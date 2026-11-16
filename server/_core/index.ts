import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerPublicFormRoutes } from "./publicForms";
import { storagePut } from "../storage";
import { getDb } from "../db";
import {
  attorneys,
  blogPosts,
  practiceAreas,
  siteSettings,
} from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";

const routeList = [
  "/",
  "/about",
  "/practice-areas",
  "/practice-areas/:slug",
  "/attorneys",
  "/attorneys/:slug",
  "/insights",
  "/insights/:slug",
  "/contact",
  "/consultation",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/admin",
];
const xml = (v: string) =>
  v.replace(
    /[<>&'\"]/g,
    c =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '\"': "&quot;",
      })[c]!
  );
async function indexingEnabled() {
  try {
    const db = await getDb();
    if (!db) return false;
    const setting = (
      await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.settingKey, "indexingEnabled"))
        .limit(1)
    )[0];
    return setting?.settingValue === "true";
  } catch {
    return false;
  }
}
async function publicOrigin() {
  let value = process.env.PUBLIC_SITE_URL?.trim() || "";
  try {
    if (!value) {
      const db = await getDb();
      if (db) {
        const setting = (
          await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.settingKey, "publicSiteUrl"))
            .limit(1)
        )[0];
        value = setting?.settingValue ?? "";
      }
    }
  } catch {}
  try {
    const u = new URL(value);
    if (u.protocol === "https:" && !u.username && !u.password) return u.origin;
  } catch {}
  return "";
}
async function sitemapXml() {
  const origin = await publicOrigin();
  if (!origin || !(await indexingEnabled()))
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  const paths = [
    "/",
    "/about",
    "/practice-areas",
    "/attorneys",
    "/insights",
    "/contact",
    "/consultation",
    "/disclaimer",
  ];
  let databaseReady = false;
  try {
    const db = await getDb();
    if (db) {
      databaseReady = true;
      const [p, a, b] = await Promise.all([
        db
          .select({ slug: practiceAreas.slug })
          .from(practiceAreas)
          .where(
            and(
              eq(practiceAreas.published, true),
              eq(practiceAreas.isDemo, false)
            )
          ),
        db
          .select({ slug: attorneys.slug })
          .from(attorneys)
          .where(
            and(eq(attorneys.published, true), eq(attorneys.isDemo, false))
          ),
        db
          .select({ slug: blogPosts.slug })
          .from(blogPosts)
          .where(
            and(eq(blogPosts.status, "published"), eq(blogPosts.isDemo, false))
          ),
      ]);
      for (const x of p) paths.push(`/practice-areas/${x.slug}`);
      for (const x of a) paths.push(`/attorneys/${x.slug}`);
      for (const x of b) paths.push(`/insights/${x.slug}`);
    }
  } catch {}
  if (!databaseReady)
    paths.push(
      "/practice-areas/corporate-commercial",
      "/practice-areas/litigation-disputes",
      "/practice-areas/property-real-estate",
      "/practice-areas/family-matrimonial",
      "/practice-areas/criminal-defence",
      "/practice-areas/employment-labour",
      "/practice-areas/intellectual-property",
      "/practice-areas/contracts",
      "/practice-areas/immigration",
      "/practice-areas/business-advisory",
      "/attorneys/alex-morgan",
      "/insights/commercial-agreement-review",
      "/insights/property-due-diligence",
      "/insights/family-law-first-conversation"
    );
  const unique = [...new Set(paths)];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${unique.map(p => `<url><loc>${xml(origin + p)}</loc></url>`).join("")}</urlset>`;
}

const app = express();
const server = createServer(app);

async function startServer() {
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "120kb" }));
  app.use(express.urlencoded({ limit: "120kb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res
      .set("Cache-Control", "no-store")
      .type("application/javascript")
      .send(publicPlatformScript());
  });
  app.get("/manus-routes.json", (_req, res) =>
    res
      .type("application/json")
      .send({ routes: routeList.map(path => ({ path })) })
  );
  app.get("/sitemap.xml", async (_req, res) => {
    res
      .set("X-Robots-Tag", "noindex")
      .type("application/xml")
      .send(await sitemapXml());
  });
  app.get("/robots.txt", async (_req, res) => {
    const origin = await publicOrigin();
    const enabled = await indexingEnabled();
    res
      .type("text/plain")
      .send(
        `User-agent: *\n${enabled ? "Allow: /\n" : "Disallow: /\n"}Disallow: /api/\nDisallow: /admin\n${origin && enabled ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`
      );
  });
  registerOAuthRoutes(app);
  registerPublicFormRoutes(app);
  app.put(
    "/api/admin/assets",
    express.raw({
      type: ["image/jpeg", "image/png", "image/webp"],
      limit: "5mb",
    }),
    async (req, res) => {
      try {
        const ctx = await createContext({ req, res } as any);
        if (!ctx.user || ctx.user.role !== "admin") {
          res.status(403).json({ error: "Administrator access required." });
          return;
        }
        const type = String(req.headers["content-type"] || "").split(";")[0];
        const ext =
          type === "image/jpeg"
            ? "jpg"
            : type === "image/png"
              ? "png"
              : type === "image/webp"
                ? "webp"
                : "";
        if (
          !ext ||
          !Buffer.isBuffer(req.body) ||
          req.body.length < 16 ||
          req.body.length > 5 * 1024 * 1024
        ) {
          res.status(400).json({
            error:
              "Upload a valid JPEG, PNG or WebP image no larger than 5 MB.",
          });
          return;
        }
        const signature = req.body.subarray(0, 12);
        const valid =
          ext === "jpg"
            ? signature[0] === 0xff && signature[1] === 0xd8
            : ext === "png"
              ? signature.toString("hex").startsWith("89504e470d0a1a0a")
              : signature.toString("ascii", 0, 4) === "RIFF" &&
                signature.toString("ascii", 8, 12) === "WEBP";
        if (!valid) {
          res.status(400).json({
            error: "The file contents do not match the selected image format.",
          });
          return;
        }
        const saved = await storagePut(
          `legal-aid/content/${crypto.randomUUID()}.${ext}`,
          req.body,
          type
        );
        res.status(201).json({ url: saved.url });
      } catch (error) {
        console.warn(
          "[Admin upload] Upload failed",
          error instanceof Error ? error.message : "unknown"
        );
        res.status(503).json({
          error:
            "The secure image storage service is unavailable. Try again later.",
        });
      }
    }
  );
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL)
    await setupVite(app, server);
  else serveStatic(app);
  if (process.env.VERCEL) return;
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");
  server.on("error", error => {
    console.error("Server failed:", error.message);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () =>
    console.log(`Server listening on port ${port}`)
  );
}
startServer().catch(error => {
  console.error("Server failed to start:", error);
  process.exit(1);
});

export { app };
export default app;
