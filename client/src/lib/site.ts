import { firmName } from "./brand";

export const siteName = `${firmName} | Attorney & Law Firm`;
export const siteOrigin = "";
export function setPageMeta(
  title: string,
  description: string,
  noindex = false
) {
  const brand =
    document.querySelector<HTMLMetaElement>('meta[name="site-brand"]')
      ?.content || firmName;
  const customTitle =
    document.querySelector<HTMLMetaElement>('meta[name="seo-title"]')
      ?.content || "";
  const customDescription =
    document.querySelector<HTMLMetaElement>('meta[name="seo-description"]')
      ?.content || "";
  const indexingEnabled =
    document.querySelector<HTMLMetaElement>('meta[name="site-indexing"]')
      ?.content === "true";
  const isHome = window.location.pathname === "/";
  document.title = isHome && customTitle ? customTitle : `${title} | ${brand}`;
  let descriptionEl = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]'
  );
  if (!descriptionEl) {
    descriptionEl = document.createElement("meta");
    descriptionEl.name = "description";
    document.head.appendChild(descriptionEl);
  }
  descriptionEl.content =
    isHome && customDescription ? customDescription : description;
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.appendChild(robots);
  }
  robots.content =
    noindex || !indexingEnabled ? "noindex,nofollow" : "index,follow";
}
export const disclaimer =
  "Browsing this website or submitting a general inquiry does not automatically establish an attorney-client relationship. Do not send confidential or highly sensitive information until the firm confirms appropriate arrangements. Content is general information, not legal advice, and must be reviewed for the applicable jurisdiction.";
export const demoNotice =
  "Demonstration content — names, details, services and credentials must be verified by the firm before publication.";
