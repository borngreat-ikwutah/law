import { COOKIE_NAME } from "@shared/const";
import { timingSafeEqual } from "node:crypto";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, like, or } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "./db";
import {
  adminBootstrap,
  attorneys,
  blogCategories,
  blogPosts,
  contactMessages,
  consultations,
  practiceAreas,
  siteSettings,
  users,
} from "../drizzle/schema";

const requireDb = async () => {
  const db = await getDb();
  if (!db)
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message:
        "The application database is unavailable. Please try again later.",
    });
  return db;
};
const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(180)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens for the URL slug."
  );
const safeLine = (max: number) => z.string().trim().min(1).max(max);
const fieldsJson = (value: string, fallback: unknown) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
const bootstrapAttempts = new Map<string, number[]>();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  publicSite: router({
    settings: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { values: {} as Record<string, string> };
      const rows = await db.select().from(siteSettings);
      const allowed = new Set([
        "officeAddress",
        "phone",
        "email",
        "hours",
        "linkedin",
        "instagram",
        "facebook",
        "publicSiteUrl",
        "mapQuery",
        "firmName",
        "seoTitle",
        "seoDescription",
      ]);
      const values: Record<string, string> = {};
      for (const row of rows)
        if (allowed.has(row.settingKey))
          values[row.settingKey] = row.settingValue;
      return { values };
    }),
    content: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db)
        return {
          configured: false,
          practices: [],
          attorneys: [],
          articles: [],
          categories: [],
        };
      const [p, a, b, c] = await Promise.all([
        db
          .select()
          .from(practiceAreas)
          .where(eq(practiceAreas.published, true))
          .orderBy(practiceAreas.sortOrder),
        db
          .select()
          .from(attorneys)
          .where(eq(attorneys.published, true))
          .orderBy(attorneys.sortOrder),
        db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"))
          .orderBy(desc(blogPosts.publishedAt)),
        db.select().from(blogCategories).orderBy(blogCategories.name),
      ]);
      return {
        configured: true,
        practices: p.map(x => ({
          ...x,
          services: fieldsJson(x.services, []),
          challenges: fieldsJson(x.challenges, []),
          assistance: fieldsJson(x.assistance, []),
          faqs: fieldsJson(x.faqs, []),
        })),
        attorneys: a.map(x => ({
          ...x,
          education: fieldsJson(x.education, []),
          credentials: fieldsJson(x.credentials, []),
          experience: fieldsJson(x.experience, []),
          languages: fieldsJson(x.languages, []),
        })),
        articles: b.map(x => ({
          ...x,
          body: fieldsJson(x.content, []),
          date:
            x.publishedAt?.toISOString().slice(0, 10) ??
            x.createdAt.toISOString().slice(0, 10),
        })),
        categories: c,
      };
    }),
  }),
  consultation: router({
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum([
            "pending",
            "approved",
            "declined",
            "completed",
            "cancelled",
          ]),
          internalNotes: z.string().max(5000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db
          .update(consultations)
          .set({
            status: input.status,
            internalNotes: input.internalNotes?.trim() || null,
          })
          .where(eq(consultations.id, input.id));
        return { ok: true };
      }),
    optOutSms: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db
          .update(consultations)
          .set({
            smsConsent: false,
            mailingAddress: null,
            smsOptOutAt: new Date(),
          })
          .where(eq(consultations.id, input.id));
        return { ok: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db.delete(consultations).where(eq(consultations.id, input.id));
        return { ok: true };
      }),
    list: adminProcedure
      .input(
        z.object({
          query: z.string().trim().max(150).optional(),
          status: z
            .enum([
              "all",
              "pending",
              "approved",
              "declined",
              "completed",
              "cancelled",
            ])
            .default("all"),
        })
      )
      .query(async ({ input }) => {
        const db = await requireDb();
        const clauses = [];
        if (input.status !== "all")
          clauses.push(eq(consultations.status, input.status));
        if (input.query) {
          const q = `%${input.query}%`;
          clauses.push(
            or(
              like(consultations.fullName, q),
              like(consultations.email, q),
              like(consultations.practiceArea, q)
            )!
          );
        }
        return db
          .select()
          .from(consultations)
          .where(clauses.length ? and(...clauses) : undefined)
          .orderBy(desc(consultations.createdAt))
          .limit(250);
      }),
  }),
  admin: router({
    bootstrapStatus: protectedProcedure.query(async () => {
      const db = await requireDb();
      const code = process.env.ADMIN_BOOTSTRAP_CODE;
      const available = Boolean(code && code.length >= 32);
      if (!available) return { available: false, claimed: false };
      await db
        .insert(adminBootstrap)
        .values({ id: 1, claimed: false })
        .onDuplicateKeyUpdate({ set: { id: 1 } });
      const row = (
        await db
          .select()
          .from(adminBootstrap)
          .where(eq(adminBootstrap.id, 1))
          .limit(1)
      )[0];
      const existingAdmin = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "admin"))
        .limit(1);
      return {
        available,
        claimed: (row?.claimed ?? false) || existingAdmin.length > 0,
      };
    }),
    claimBootstrap: protectedProcedure
      .input(z.object({ code: z.string().min(32).max(256) }))
      .mutation(async ({ ctx, input }) => {
        const expected = process.env.ADMIN_BOOTSTRAP_CODE;
        if (!expected || expected.length < 32)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "One-time administrator setup is not configured.",
          });
        const now = Date.now();
        const prior = (bootstrapAttempts.get(ctx.user.openId) ?? []).filter(
          t => now - t < 60 * 60_000
        );
        if (prior.length >= 5)
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many setup attempts. Please try again later.",
          });
        const actualBuffer = Buffer.from(input.code, "utf8");
        const expectedBuffer = Buffer.from(expected, "utf8");
        if (
          actualBuffer.length !== expectedBuffer.length ||
          !timingSafeEqual(actualBuffer, expectedBuffer)
        ) {
          bootstrapAttempts.set(ctx.user.openId, [...prior, now]);
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "The setup code is not valid.",
          });
        }
        const db = await requireDb();
        await db
          .insert(adminBootstrap)
          .values({ id: 1, claimed: false })
          .onDuplicateKeyUpdate({ set: { id: 1 } });
        await db.transaction(async tx => {
          const [claim] = await tx
            .select()
            .from(adminBootstrap)
            .where(eq(adminBootstrap.id, 1))
            .for("update");
          if (!claim || claim.claimed)
            throw new TRPCError({
              code: "CONFLICT",
              message: "Administrator setup has already been claimed.",
            });
          const existing = await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.role, "admin"))
            .limit(1);
          if (existing.length)
            throw new TRPCError({
              code: "CONFLICT",
              message: "An administrator account already exists.",
            });
          await tx
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.id, ctx.user.id));
          await tx
            .update(adminBootstrap)
            .set({
              claimed: true,
              claimedBy: ctx.user.id,
              claimedAt: new Date(),
            })
            .where(eq(adminBootstrap.id, 1));
        });
        bootstrapAttempts.delete(ctx.user.openId);
        return { ok: true };
      }),
    dashboard: adminProcedure.query(async () => {
      const db = await requireDb();
      const [c, m, a] = await Promise.all([
        db.select().from(consultations),
        db.select().from(contactMessages),
        db.select().from(blogPosts),
      ]);
      return {
        consultations: c.length,
        pending: c.filter(x => x.status === "pending").length,
        approved: c.filter(x => x.status === "approved").length,
        messages: m.length,
        newMessages: m.filter(x => x.status === "new").length,
        publishedArticles: a.filter(x => x.status === "published").length,
        recentMessages: m
          .sort((x, y) => y.createdAt.getTime() - x.createdAt.getTime())
          .slice(0, 5),
      };
    }),
    emailStatus: adminProcedure.query(() => ({
      configured: Boolean(
        process.env.RESEND_API_KEY &&
          process.env.EMAIL_FROM &&
          process.env.ADMIN_NOTIFICATION_EMAIL
      ),
    })),
    messages: adminProcedure
      .input(
        z.object({
          status: z.enum(["all", "new", "read", "closed"]).default("all"),
          query: z.string().trim().max(150).optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await requireDb();
        const clauses = [];
        if (input.status !== "all")
          clauses.push(eq(contactMessages.status, input.status));
        if (input.query) {
          const q = `%${input.query}%`;
          clauses.push(
            or(
              like(contactMessages.fullName, q),
              like(contactMessages.email, q),
              like(contactMessages.subject, q)
            )!
          );
        }
        return db
          .select()
          .from(contactMessages)
          .where(clauses.length ? and(...clauses) : undefined)
          .orderBy(desc(contactMessages.createdAt))
          .limit(250);
      }),
    updateMessage: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "read", "closed"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db
          .update(contactMessages)
          .set({ status: input.status })
          .where(eq(contactMessages.id, input.id));
        return { ok: true };
      }),
    optOutMessage: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db
          .update(contactMessages)
          .set({
            smsConsent: false,
            mailingAddress: null,
            smsOptOutAt: new Date(),
          })
          .where(eq(contactMessages.id, input.id));
        return { ok: true };
      }),
    deleteMessage: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        await db
          .delete(contactMessages)
          .where(eq(contactMessages.id, input.id));
        return { ok: true };
      }),
    content: adminProcedure.query(async () => {
      const db = await requireDb();
      const [practices, people, posts, categories] = await Promise.all([
        db.select().from(practiceAreas).orderBy(practiceAreas.sortOrder),
        db.select().from(attorneys).orderBy(attorneys.sortOrder),
        db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)),
        db.select().from(blogCategories).orderBy(blogCategories.name),
      ]);
      return {
        practices: practices.map(x => ({
          ...x,
          services: fieldsJson(x.services, []),
          challenges: fieldsJson(x.challenges, []),
          assistance: fieldsJson(x.assistance, []),
          faqs: fieldsJson(x.faqs, []),
        })),
        attorneys: people.map(x => ({
          ...x,
          education: fieldsJson(x.education, []),
          credentials: fieldsJson(x.credentials, []),
          experience: fieldsJson(x.experience, []),
          languages: fieldsJson(x.languages, []),
        })),
        articles: posts.map(x => ({ ...x, body: fieldsJson(x.content, []) })),
        categories,
      };
    }),
    savePractice: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive().optional(),
          slug: slugSchema,
          title: safeLine(180),
          summary: safeLine(1800),
          overview: safeLine(6000),
          services: z.array(safeLine(500)).max(20),
          challenges: z.array(safeLine(500)).max(20),
          assistance: z.array(safeLine(500)).max(20),
          faqs: z
            .array(
              z.object({ question: safeLine(300), answer: safeLine(1500) })
            )
            .max(20),
          imageUrl: z.string().trim().max(500).optional().default(""),
          published: z.boolean().default(false),
          isDemo: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const db = await requireDb();
        const { id, ...rest } = input;
        const values = {
          ...rest,
          services: JSON.stringify(rest.services),
          challenges: JSON.stringify(rest.challenges),
          assistance: JSON.stringify(rest.assistance),
          faqs: JSON.stringify(rest.faqs),
          imageUrl: rest.imageUrl || null,
        };
        if (id)
          await db
            .update(practiceAreas)
            .set(values)
            .where(eq(practiceAreas.id, id));
        else await db.insert(practiceAreas).values(values);
        return { ok: true };
      }),
    saveAttorney: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive().optional(),
          slug: slugSchema,
          fullName: safeLine(180),
          title: safeLine(180),
          specialty: safeLine(255),
          summary: safeLine(1800),
          biography: safeLine(5000),
          education: z.array(safeLine(500)).max(20),
          credentials: z.array(safeLine(500)).max(20),
          experience: z.array(safeLine(500)).max(20),
          languages: z.array(safeLine(100)).max(20),
          photoUrl: z.string().trim().max(500).optional().default(""),
          published: z.boolean().default(false),
          isDemo: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const db = await requireDb();
        const { id, ...r } = input;
        const values = {
          ...r,
          education: JSON.stringify(r.education),
          credentials: JSON.stringify(r.credentials),
          experience: JSON.stringify(r.experience),
          languages: JSON.stringify(r.languages),
          photoUrl: r.photoUrl || null,
        };
        if (id)
          await db.update(attorneys).set(values).where(eq(attorneys.id, id));
        else await db.insert(attorneys).values(values);
        return { ok: true };
      }),
    saveArticle: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive().optional(),
          slug: slugSchema,
          title: safeLine(240),
          category: safeLine(120),
          excerpt: safeLine(1800),
          content: z.array(safeLine(5000)).min(1).max(40),
          author: safeLine(180),
          imageUrl: z.string().trim().max(500).optional().default(""),
          status: z.enum(["draft", "published"]),
          isDemo: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const db = await requireDb();
        const { id, ...r } = input;
        const values = {
          slug: r.slug,
          title: r.title,
          category: r.category,
          excerpt: r.excerpt,
          content: JSON.stringify(r.content),
          author: r.author,
          imageUrl: r.imageUrl || null,
          status: r.status,
          publishedAt: r.status === "published" ? new Date() : null,
          isDemo: r.isDemo,
        };
        if (id)
          await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
        else await db.insert(blogPosts).values(values);
        if (r.category)
          await db
            .insert(blogCategories)
            .values({
              name: r.category,
              slug: r.category
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
            })
            .onDuplicateKeyUpdate({ set: { name: r.category } });
        return { ok: true };
      }),
    saveCategory: adminProcedure
      .input(z.object({ name: safeLine(120) }))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        const slug = input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        await db
          .insert(blogCategories)
          .values({ name: input.name, slug })
          .onDuplicateKeyUpdate({ set: { name: input.name } });
        return { ok: true };
      }),
    settings: adminProcedure.query(async () => {
      const db = await requireDb();
      const rows = await db.select().from(siteSettings);
      return Object.fromEntries(rows.map(r => [r.settingKey, r.settingValue]));
    }),
    saveSettings: adminProcedure
      .input(z.record(z.string().max(120), z.string().max(1000)))
      .mutation(async ({ input }) => {
        const db = await requireDb();
        const allowed = new Set([
          "officeAddress",
          "phone",
          "email",
          "hours",
          "linkedin",
          "instagram",
          "facebook",
          "publicSiteUrl",
          "mapQuery",
          "firmName",
          "seoTitle",
          "seoDescription",
          "indexingEnabled",
        ]);
        for (const [key, value] of Object.entries(input))
          if (allowed.has(key))
            await db
              .insert(siteSettings)
              .values({ settingKey: key, settingValue: value })
              .onDuplicateKeyUpdate({ set: { settingValue: value } });
        return { ok: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
