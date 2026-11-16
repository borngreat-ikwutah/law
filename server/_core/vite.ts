import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  attorneys,
  blogPosts,
  practiceAreas,
  siteSettings,
} from "../../drizzle/schema";

const staticPages: Record<
  string,
  {
    title: string;
    description: string;
    heading: string;
    copy: string;
    noindex?: boolean;
  }
> = {
  "/": {
    title: "Legal Services",
    description:
      "Learn about LEGAL AID LEGAL SERVICES LLC, browse general legal information, and request a consultation. Confirm service areas and professional credentials before publication.",
    heading: "Committed to Justice. Dedicated to Your Future.",
    copy: "This is a demonstration website for LEGAL AID LEGAL SERVICES LLC. Practice areas, attorney credentials, and jurisdiction details must be verified by the business before reliance or publication.",
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about LEGAL AID LEGAL SERVICES LLC's legal philosophy, professional values, and client-centered approach.",
    heading: "Purposeful counsel. Principled representation.",
    copy: "LEGAL AID LEGAL SERVICES LLC is presented as a professional legal practice built on trust, integrity, careful analysis, and clear communication.",
  },
  "/practice-areas": {
    title: "Practice Areas",
    description:
      "Explore provisional legal service categories and learn how to request a consultation.",
    heading: "Legal insight for consequential decisions.",
    copy: "Explore the legal categories represented in this demonstration. Actual services are subject to confirmation by the firm.",
  },
  "/attorneys": {
    title: "Our Attorneys",
    description: "Meet the attorney team and review professional profiles.",
    heading: "Counsel grounded in experience.",
    copy: "Attorney identities, credentials, and professional details must be verified by the firm before publication.",
  },
  "/insights": {
    title: "Legal Insights",
    description:
      "Explore general legal educational resources and professional perspectives.",
    heading: "Ideas for better-informed decisions.",
    copy: "General legal education can help frame useful questions. Articles are illustrative and are not legal advice.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Contact LEGAL AID LEGAL SERVICES LLC with a general inquiry or request a consultation.",
    heading: "A straightforward point of contact.",
    copy: "Reach out with a general inquiry. Do not send confidential or highly sensitive information through a general website form.",
  },
  "/consultation": {
    title: "Book a Consultation",
    description:
      "Request a consultation. A request is not confirmed until approved by the firm.",
    heading: "A clear first step.",
    copy: "Submit a brief, non-sensitive consultation request. It is not an appointment until the firm reviews and approves it.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "How LEGAL AID LEGAL SERVICES LLC handles contact details and SMS customer-care preferences.",
    heading: "Privacy Policy",
    copy: "LEGAL AID LEGAL SERVICES LLC respects your privacy. SMS is for customer care only. For HELP or STOP contact (866) 356-7238, (866) 838-0117, (877) 217-9029, or legaldocuments19803@yahoo.com. Automated SMS delivery is not active until a provider is connected. Mobile opt-in data is not sold, rented, or shared.",
    noindex: true,
  },
  "/terms": {
    title: "Terms & Conditions",
    description:
      "Website and SMS customer-care messaging terms for LEGAL AID LEGAL SERVICES LLC.",
    heading: "Terms & Conditions",
    copy: "By opting in, you agree to recurring SMS customer-care messages; frequency varies, message and data rates may apply, and consent is not a condition of purchase. Reply STOP or CANCEL to opt out and HELP for assistance. When SMS delivery is configured, an opt-out confirmation may be sent; until a provider is connected this website cannot send or confirm texts. For HELP or STOP contact (866) 356-7238, (866) 838-0117, (877) 217-9029, or legaldocuments19803@yahoo.com.",
    noindex: true,
  },
  "/disclaimer": {
    title: "Legal Disclaimer",
    description:
      "Important information about general legal content and the absence of an attorney-client relationship.",
    heading: "Legal Disclaimer",
    copy: "Browsing this website or submitting a general inquiry does not automatically establish an attorney-client relationship.",
  },
  "/admin": {
    title: "Administrator Dashboard",
    description: "Secure administrator access.",
    heading: "Administrator access",
    copy: "Sign in with an authorized account to continue.",
    noindex: true,
  },
};
const demoPracticeSlugs = new Set([
  "corporate-commercial",
  "litigation-disputes",
  "property-real-estate",
  "family-matrimonial",
  "criminal-defence",
  "employment-labour",
  "intellectual-property",
  "contracts",
  "immigration",
  "business-advisory",
]);
const demoAttorneySlugs = new Set(["alex-morgan"]);
const demoArticleSlugs = new Set([
  "commercial-agreement-review",
  "property-due-diligence",
  "family-law-first-conversation",
  "preparing-for-a-first-legal-consultation",
]);
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!
  );
const slugTitle = (slug: string) =>
  slug
    .split("-")
    .map(x => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");

async function routeInfo(pathname: string) {
  if (staticPages[pathname])
    return { info: staticPages[pathname], found: true };
  const match = pathname.match(
    /^\/(practice-areas|attorneys|insights)\/([a-z0-9-]+)$/
  );
  if (!match)
    return {
      info: {
        title: "Page Not Found",
        description: "The requested page could not be found.",
        heading: "This page isn't here.",
        copy: "The link may have changed or the page may not be available.",
        noindex: true,
      },
      found: false,
    };
  const [, kind, slug] = match;
  let row: any = null;
  let databaseReady = false;
  try {
    const db = await getDb();
    if (db) {
      databaseReady = true;
      if (kind === "practice-areas")
        row = (
          await db
            .select({
              title: practiceAreas.title,
              summary: practiceAreas.summary,
              imagePath: practiceAreas.imageUrl,
              isDemo: practiceAreas.isDemo,
            })
            .from(practiceAreas)
            .where(
              and(
                eq(practiceAreas.slug, slug),
                eq(practiceAreas.published, true)
              )
            )
            .limit(1)
        )[0];
      if (kind === "attorneys")
        row = (
          await db
            .select({
              title: attorneys.fullName,
              summary: attorneys.summary,
              imagePath: attorneys.photoUrl,
              isDemo: attorneys.isDemo,
            })
            .from(attorneys)
            .where(and(eq(attorneys.slug, slug), eq(attorneys.published, true)))
            .limit(1)
        )[0];
      if (kind === "insights")
        row = (
          await db
            .select({
              title: blogPosts.title,
              summary: blogPosts.excerpt,
              imagePath: blogPosts.imageUrl,
              isDemo: blogPosts.isDemo,
            })
            .from(blogPosts)
            .where(
              and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published"))
            )
            .limit(1)
        )[0];
    }
  } catch {}
  const demo =
    (kind === "practice-areas" && demoPracticeSlugs.has(slug)) ||
    (kind === "attorneys" && demoAttorneySlugs.has(slug)) ||
    (kind === "insights" && demoArticleSlugs.has(slug));
  if (!row && (!demo || databaseReady))
    return {
      info: {
        title: "Page Not Found",
        description: "The requested page could not be found.",
        heading: "This page isn't here.",
        copy: "The requested content is unavailable or unpublished.",
        noindex: true,
      },
      found: false,
    };
  const title = row?.title ?? slugTitle(slug);
  const description =
    row?.summary ??
    "Illustrative demonstration content. Confirm the firm's actual services, credentials, and legal information before publication.";
  return {
    info: {
      title,
      description,
      heading: title,
      copy: description,
      noindex: Boolean(row?.isDemo),
      imagePath: row?.imagePath ?? undefined,
    },
    found: true,
  };
}
type SiteSeo = {
  origin: string;
  brand: string;
  seoTitle: string;
  seoDescription: string;
  indexingEnabled: boolean;
};

async function getSiteSeo(): Promise<SiteSeo> {
  let values: Record<string, string> = {};
  try {
    const db = await getDb();
    if (db) {
      const rows = await db.select().from(siteSettings);
      values = Object.fromEntries(
        rows.map(row => [row.settingKey, row.settingValue])
      );
    }
  } catch {}
  const candidate =
    process.env.PUBLIC_SITE_URL?.trim() || values.publicSiteUrl?.trim() || "";
  let origin = "";
  try {
    const url = candidate ? new URL(candidate) : null;
    if (url && url.protocol === "https:" && !url.username && !url.password)
      origin = url.origin;
  } catch {}
  return {
    origin,
    brand: values.firmName?.trim() || "LEGAL AID LEGAL SERVICES LLC",
    seoTitle: values.seoTitle?.trim() || "",
    seoDescription: values.seoDescription?.trim() || "",
    indexingEnabled: values.indexingEnabled === "true",
  };
}

function addSeo(
  template: string,
  pathname: string,
  info: {
    title: string;
    description: string;
    heading: string;
    copy: string;
    noindex?: boolean;
    imagePath?: string;
  },
  seo: SiteSeo
) {
  const title =
    pathname === "/" && seo.seoTitle
      ? seo.seoTitle
      : `${info.title} | ${seo.brand}`;
  const description =
    pathname === "/" && seo.seoDescription
      ? seo.seoDescription
      : info.description;
  const canon = seo.origin
    ? `<link rel="canonical" href="${esc(seo.origin + pathname)}"/>`
    : "";
  const imagePath =
    info.imagePath ||
    "/manus-storage/async-images/InJ3eL7NtwzCaMc7Vhsltz/image-1.webp";
  const absoluteImage = seo.origin
    ? imagePath.startsWith("https://")
      ? imagePath
      : imagePath.startsWith("/")
        ? seo.origin + imagePath
        : ""
    : "";
  const og = `<meta property="og:type" content="website"/><meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(description)}"/><meta property="og:site_name" content="${esc(seo.brand)}"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(title)}"/><meta name="twitter:description" content="${esc(description)}"/>${seo.origin ? `<meta property="og:url" content="${esc(seo.origin + pathname)}"/>` : ""}${absoluteImage ? `<meta property="og:image" content="${esc(absoluteImage)}"/><meta name="twitter:image" content="${esc(absoluteImage)}"/>` : ""}`;
  const structured = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: seo.brand,
    ...(seo.origin ? { url: seo.origin } : {}),
  }).replace(/</g, "\\u003c");
  const body = `<section style="max-width:1100px;margin:0 auto;padding:40px 24px;font-family:Georgia,serif;color:#10243a"><p style="font:600 12px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9b814b">${esc(seo.brand)} · ATTORNEY &amp; LAW FIRM</p><h1 style="font-size:clamp(38px,7vw,74px);line-height:1.06;font-weight:400">${esc(info.heading)}</h1><p style="max-width:680px;font:16px/1.8 Arial,sans-serif;color:#59636b">${esc(info.copy)}</p><nav aria-label="Page navigation" style="display:flex;gap:18px;flex-wrap:wrap;font:13px Arial,sans-serif"><a href="/practice-areas">Practice Areas</a><a href="/attorneys">Attorneys</a><a href="/insights">Insights</a><a href="/contact">Contact</a><a href="/consultation">Request a Consultation</a></nav><p style="margin-top:30px;font:12px/1.7 Arial,sans-serif;color:#7b8388">Demonstration content. Browsing this website or submitting a general inquiry does not automatically establish an attorney-client relationship.</p></section>`;
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${esc(title)}</title>`
  );
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${esc(description)}"/>`
  );
  html = html.replace(
    /<meta\s+name="robots"[^>]*>/i,
    `<meta name="robots" content="${info.noindex || !seo.indexingEnabled ? "noindex,nofollow" : "index,follow"}"/>`
  );
  const settingsMeta = `<meta name="site-brand" content="${esc(seo.brand)}"/><meta name="seo-title" content="${esc(seo.seoTitle)}"/><meta name="seo-description" content="${esc(seo.seoDescription)}"/><meta name="site-indexing" content="${seo.indexingEnabled ? "true" : "false"}"/><script type="application/ld+json">${structured}</script>`;
  html = html.replace("</head>", `${canon}${og}${settingsMeta}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const rawPath = (req.originalUrl || "/").split("?")[0];
    let pathname: string;
    try {
      pathname = decodeURIComponent(rawPath);
    } catch {
      res.status(400).end();
      return;
    }
    const result = await routeInfo(pathname);
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const seo = await getSiteSeo();
      const page = await vite.transformIndexHtml(
        req.originalUrl,
        addSeo(template, pathname, result.info, seo)
      );
      res
        .status(result.found ? 200 : 404)
        .set({ "Content-Type": "text/html" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

const legacyManusImages: Record<string, string> = {
  "/manus-storage/async-images/InJ3eL7NtwzCaMc7Vhsltz/image-1.webp":
    "hero.webp",
  "/manus-storage/async-images/InJ3eL7NtwzCaMc7Vhsltz/image-2.webp":
    "attorney.webp",
  "/manus-storage/async-images/InJ3eL7NtwzCaMc7Vhsltz/image-3.webp":
    "commercial.webp",
  "/manus-storage/async-images/csgif3XoQ5dsCIWFMC5FYX/image-1.webp":
    "property-article.webp",
  "/manus-storage/async-images/csgif3XoQ5dsCIWFMC5FYX/image-2.webp":
    "family-article.webp",
  "/manus-storage/async-images/qD6Tri7s8yXquFmvueRkOj/image-1.webp":
    "consultation.webp",
};

export function serveStatic(app: Express) {
  const isVercel = Boolean(process.env.VERCEL);
  const distPath = isVercel
    ? path.resolve(process.cwd(), "public")
    : process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  const templatePath = isVercel
    ? path.resolve(distPath, "__runtime", "index.html")
    : path.resolve(distPath, "index.html");
  if (!fs.existsSync(distPath))
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  for (const [legacyPath, filename] of Object.entries(legacyManusImages)) {
    app.get(legacyPath, (_req, res) =>
      res.redirect(302, `/assets/images/${filename}`)
    );
  }
  app.use(express.static(distPath, { index: false }));
  app.get("/404", async (_req, res, next) => {
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const seo = await getSiteSeo();
      res
        .status(404)
        .type("html")
        .send(
          addSeo(
            template,
            "/404",
            {
              title: "Page Not Found",
              description: "The requested page could not be found.",
              heading: "This page isn't here.",
              copy: "The link may have changed or the page may not be available.",
              noindex: true,
            },
            seo
          )
        );
    } catch (error) {
      next(error);
    }
  });
  app.use("*", async (req, res, next) => {
    const rawPath = (req.originalUrl || "/").split("?")[0];
    let pathname: string;
    try {
      pathname = decodeURIComponent(rawPath);
    } catch {
      res.status(400).end();
      return;
    }
    const result = await routeInfo(pathname);
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const seo = await getSiteSeo();
      res
        .status(result.found ? 200 : 404)
        .type("html")
        .send(addSeo(template, pathname, result.info, seo));
    } catch (e) {
      next(e);
    }
  });
}
