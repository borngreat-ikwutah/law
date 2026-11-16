import { useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  Handshake,
  Landmark,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { heroImage } from "@/data/site";
import { setPageMeta } from "@/lib/site";
import { usePublicContent } from "@/lib/content";
import { DemoNotice } from "@/components/site/SiteShell";

const practiceIcons = [
  BriefcaseBusiness,
  Scale,
  Building2,
  UsersRound,
  ShieldCheck,
  Handshake,
];
const values = [
  [
    "01",
    "Client-focused representation",
    "Thoughtful listening and clear priorities help keep legal work connected to the people and organizations it serves.",
  ],
  [
    "02",
    "Professional integrity",
    "Straightforward communication and principled judgment are central to a trusted professional relationship.",
  ],
  [
    "03",
    "Strategic solutions",
    "Careful analysis turns complexity into practical options, with trade-offs explained along the way.",
  ],
  [
    "04",
    "Clear communication",
    "Clients deserve timely updates, plain-language explanations, and an understanding of what comes next.",
  ],
  [
    "05",
    "Confidentiality",
    "Sensitive matters call for discretion and care. Please do not send highly confidential information through this website.",
  ],
  [
    "06",
    "Commitment to excellence",
    "Preparation, attention to detail, and professional accountability guide every stage of the work.",
  ],
];

export default function Home() {
  const live = usePublicContent();
  const practices = live.practices;
  const attorneys = live.attorneys;
  const articles = live.articles;
  useEffect(
    () =>
      setPageMeta(
        "Attorney & Law Firm",
        "Learn about LEGAL AID LEGAL SERVICES LLC, browse general legal information, and request a consultation. Practice areas, credentials, and jurisdictions are demonstration content pending firm verification."
      ),
    []
  );
  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src={heroImage}
          alt="Refined contemporary law office interior with natural light"
          fetchPriority="high"
        />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              Clarity in every conversation · Purpose in every next step
            </span>
            <h1 className="serif">
              Committed to Justice. Dedicated to Your Future.
            </h1>
            <p>
              Explore general legal information and request a consultation with
              LEGAL AID LEGAL SERVICES LLC. Practice areas, attorney
              credentials, and jurisdiction details on this demonstration site
              must be verified by the business before reliance.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="/consultation">
                Schedule a Consultation <ArrowUpRight size={15} />
              </Link>
              <Link className="btn btn-outline" href="/practice-areas">
                Explore Our Practice Areas <ArrowRight size={15} />
              </Link>
            </div>
            <div className="hero-meta">
              <span />
              Clear information. A considered first step.
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container intro-grid">
          <div>
            <span className="eyebrow">A considered approach</span>
            <h2 className="intro-statement">
              Legal Excellence Built on Trust and Integrity.
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              Legal questions often arrive at important moments. This
              demonstration presents LEGAL AID LEGAL SERVICES LLC with an
              editorial focus on listening, clarity, and considered next steps.
              The business&apos;s actual legal status, services, and
              jurisdiction must be verified before relying on this information.
            </p>
            <p>
              This illustrative approach shows a possible path from an initial
              conversation through review of facts, options, and next steps;
              confirm the business&apos;s procedures before engagement.
            </p>
            <DemoNotice>
              Demonstration website content. Confirm the firm's identity, actual
              services, jurisdiction and credentials before publication.
            </DemoNotice>
            <Link className="text-link" href="/about">
              Learn about our approach <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Areas of counsel</span>
            <h2>Focused legal support for complex decisions.</h2>
            <p>
              Explore the legal categories represented in this demonstration.
              Actual services are subject to confirmation by the firm and
              applicable professional rules.
            </p>
          </div>
          <div className="practice-grid">
            {practices.slice(0, 6).map((item, index) => {
              const Icon = practiceIcons[index % practiceIcons.length];
              return (
                <article className="practice-card" key={item.slug}>
                  <span className="practice-icon">
                    <Icon size={19} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.short}</p>
                  <Link
                    className="text-link"
                    href={`/practice-areas/${item.slug}`}
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link className="text-link" href="/practice-areas">
              View all practice areas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section values-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">
              The LEGAL AID LEGAL SERVICES LLC difference
            </span>
            <h2>Principles that guide our work.</h2>
            <p>
              Professional service is built through careful decisions,
              consistent communication, and respect for the trust clients place
              in their counsel.
            </p>
          </div>
          <div className="values-grid">
            {values.map(([number, title, copy]) => (
              <article className="value-item" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {attorneys.length > 0 && (
        <section className="section">
          <div className="container attorney-feature">
            <div className="portrait-wrap">
              <img
                src={attorneys[0].photo}
                alt="Illustrative portrait for fictional demo attorney Alex Morgan"
                loading="lazy"
              />
              <span className="portrait-frame" />
            </div>
            <div className="attorney-copy">
              <span className="eyebrow">Meet our team</span>
              <h2>{attorneys[0].name}</h2>
              <p className="eyebrow" style={{ color: "#8b7447" }}>
                {attorneys[0].title}
              </p>
              <p>{attorneys[0].bio}</p>
              <p>
                <strong>Specialization:</strong> {attorneys[0].specialty}
              </p>
              <div className="tag-list">
                <span className="tag">Commercial Counsel</span>
                <span className="tag">Dispute Resolution</span>
                <span className="tag">Demo profile</span>
              </div>
              <Link
                className="text-link"
                href={`/attorneys/${attorneys[0].slug}`}
              >
                View profile <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div
            className="section-head"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow">Legal perspectives</span>
              <h2>Insights for a changing world.</h2>
              <p>
                General educational resources, not legal advice. Content is
                illustrative and should be reviewed for jurisdictional accuracy.
              </p>
            </div>
            <Link className="text-link" href="/insights">
              Explore insights <ArrowRight size={14} />
            </Link>
          </div>
          <div className="article-grid">
            {articles.slice(0, 3).map(article => (
              <article className="article-card" key={article.slug}>
                <Link
                  href={`/insights/${article.slug}`}
                  aria-label={`Read ${article.title}`}
                >
                  <img
                    src={article.image}
                    alt="Editorial image illustrating a legal insight article"
                    loading="lazy"
                  />
                </Link>
                <div className="article-card-body">
                  <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <span>
                      {new Date(article.date).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3>
                    <Link href={`/insights/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p>{article.excerpt}</p>
                  <Link
                    className="text-link"
                    href={`/insights/${article.slug}`}
                  >
                    Read article <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="container cta-grid">
          <div>
            <span className="eyebrow">Start a conversation</span>
            <h2>Let's Discuss Your Legal Needs.</h2>
            <p>
              Speak with our team to understand your options and explore the
              right legal approach for your situation.
            </p>
          </div>
          <Link className="btn btn-navy" href="/contact">
            Contact Our Office <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
