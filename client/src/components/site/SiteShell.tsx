import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import {
  businessAddressNotice,
  businessEmail,
  businessHoursNotice,
  firmName,
  getPhoneNumbers,
  phoneHref,
} from "@/lib/brand";
import { usePublicContent } from "@/lib/content";
import { trpc } from "@/lib/trpc";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label={`${firmName} — home`}>
      <img
        className="wordmark-logo"
        src="/legal-aid-logo.png"
        alt=""
        width={60}
        height={60}
      />
      <span className="wordmark-copy">
        <span className="wordmark-text">LEGAL AID</span>
        <span className="wordmark-caption">LEGAL SERVICES LLC</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  return (
    <header className="site-header">
      <div className="container nav-row">
        <Wordmark />
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={
                path === item.href ||
                (item.href !== "/" && path.startsWith(item.href))
                  ? "active"
                  : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn nav-cta" href="/consultation">
          Schedule a Consultation <ArrowUpRight size={15} />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[
            ...navItems,
            { href: "/consultation", label: "Book a Consultation" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ChevronRight size={15} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function DemoNotice({
  children = "Practice areas and attorney credentials are demonstration content. The office address, business hours and SMS delivery provider have not been configured.",
}: {
  children?: string;
}) {
  return (
    <div className="demo-banner" role="note">
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="serif">{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}

function safeSocialUrl(value?: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export function SiteFooter() {
  const live = usePublicContent();
  const settings = trpc.publicSite.settings.useQuery(undefined, {
    retry: false,
  });
  const cfg = settings.data?.values ?? {};
  const socials = [
    ["LinkedIn", cfg.linkedin],
    ["Instagram", cfg.instagram],
    ["Facebook", cfg.facebook],
  ]
    .map(([label, url]) => ({ label, url: safeSocialUrl(url) }))
    .filter(item => item.url);
  const phones = getPhoneNumbers(cfg.phone);
  const areaList = live.practices.slice(0, 5);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Wordmark />
            <p className="footer-description">
              Strategic legal counsel, thoughtful representation, and practical
              guidance for consequential decisions.
            </p>
            <div style={{ marginTop: 20 }}>
              <DemoNotice>
                Verify legal services, attorney credentials, legal policies and
                office location before publication.
              </DemoNotice>
            </div>
          </div>
          <div>
            <h2 className="footer-heading">Explore</h2>
            <div className="footer-links">
              {navItems.map(item => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/consultation">Book a Consultation</Link>
            </div>
          </div>
          <div>
            <h2 className="footer-heading">Practice areas</h2>
            <div className="footer-links">
              {areaList.map(item => (
                <Link key={item.slug} href={`/practice-areas/${item.slug}`}>
                  {item.title}
                </Link>
              ))}
              <Link href="/practice-areas">All practice areas</Link>
            </div>
          </div>
          <div>
            <h2 className="footer-heading">Contact</h2>
            <div className="footer-links">
              <span>{cfg.officeAddress || businessAddressNotice}</span>
              {phones.map(number => (
                <a key={number} href={phoneHref(number)}>
                  {number}
                </a>
              ))}
              <a href={`mailto:${cfg.email || businessEmail}`}>
                {cfg.email || businessEmail}
              </a>
              <span>{cfg.hours || businessHoursNotice}</span>
              {socials.length ? (
                socials.map(item => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label} <ArrowUpRight size={12} />
                  </a>
                ))
              ) : (
                <span>Social profiles pending verification</span>
              )}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {firmName}. All rights reserved.
          </span>
          <div
            className="footer-links"
            style={{ display: "flex", gap: 18, flexWrap: "wrap" }}
          >
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/disclaimer">Legal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="sr-only focus-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
