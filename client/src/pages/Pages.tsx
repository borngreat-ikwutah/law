import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Mail,
  MapPin,
  Phone,
  Scale,
  Search,
  Share2,
} from "lucide-react";
import { Link, useParams } from "wouter";
import NotFound from "@/pages/NotFound";
import {
  articles,
  attorneys,
  categories,
  practiceAreas,
  practiceTypes,
} from "@/data/site";
import { demoNotice, setPageMeta } from "@/lib/site";
import {
  businessAddressNotice,
  businessEmail,
  businessHoursNotice,
  getPhoneNumbers,
  phoneHref,
} from "@/lib/brand";
import { DemoNotice, PageHero } from "@/components/site/SiteShell";
import { trpc } from "@/lib/trpc";
import { usePublicContent } from "@/lib/content";

export function AboutPage() {
  useEffect(
    () =>
      setPageMeta(
        "About Us",
        "Learn about LEGAL AID LEGAL SERVICES LLC's professional philosophy, mission, values, and client-centered approach."
      ),
    []
  );
  return (
    <>
      <PageHero
        eyebrow="About LEGAL AID LEGAL SERVICES LLC"
        title="Purposeful counsel. Principled representation."
        intro="A professional legal practice built on trust, integrity, and a commitment to helping clients make informed decisions."
      />
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="intro-statement">
              A practice shaped by responsibility.
            </h2>
            <div className="body-copy">
              <p>
                LEGAL AID LEGAL SERVICES LLC is presented as a modern legal
                practice with a clear purpose: to provide considered legal
                support, communicate with care, and help clients understand the
                choices before them.
              </p>
              <p>
                Our work is founded on a simple belief: legal excellence begins
                with listening and continues through diligent preparation,
                candid advice, and respect for the people who rely on us.
              </p>
            </div>
            <DemoNotice>{demoNotice}</DemoNotice>
          </div>
          <div style={{ background: "#e9e6df", padding: 36 }}>
            <span className="eyebrow">Our mission</span>
            <p
              className="serif"
              style={{
                fontSize: "2.25rem",
                lineHeight: 1.2,
                color: "#10243a",
                margin: "17px 0 26px",
              }}
            >
              To offer professional legal services and practical solutions with
              clarity, integrity, and purpose.
            </p>
            <span className="eyebrow">Our vision</span>
            <p className="body-copy">
              To earn lasting trust through legal excellence, responsible
              innovation, and an enduring commitment to the clients and
              communities we serve.
            </p>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What guides us</span>
            <h2>Core values, practiced every day.</h2>
          </div>
          <div className="values-list">
            {[
              [
                "Integrity",
                "We act with honesty, independence, and respect for professional obligations.",
              ],
              [
                "Excellence",
                "We prepare carefully and pursue high standards in every aspect of our work.",
              ],
              [
                "Accountability",
                "We take responsibility for our advice, actions, and communication.",
              ],
              [
                "Confidentiality",
                "We handle sensitive information with appropriate discretion and safeguards.",
              ],
              [
                "Professionalism",
                "We bring sound judgment, preparation, and respect to every engagement.",
              ],
              [
                "Client commitment",
                "We listen closely and keep the client's goals at the center of our work.",
              ],
            ].map(([title, copy]) => (
              <div className="value-box" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our approach</span>
            <h2>From first conversation to considered action.</h2>
          </div>
          <div className="practice-grid">
            {[
              [
                "01",
                "Listen",
                "We understand the context, priorities, and questions that matter.",
              ],
              [
                "02",
                "Assess",
                "We review the relevant circumstances and explain potential options.",
              ],
              [
                "03",
                "Plan",
                "We develop a strategy grounded in the facts, law, and client's goals.",
              ],
              [
                "04",
                "Represent",
                "We support the client through the agreed course of action and keep communication clear.",
              ],
            ].map(([number, title, copy]) => (
              <div className="practice-card" key={number}>
                <span className="eyebrow">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 35 }}>
            <DemoNotice>
              Professional credentials, memberships, certifications,
              jurisdiction and affiliations will be added only after
              verification by the firm.
            </DemoNotice>
          </div>
        </div>
      </section>
    </>
  );
}

export function PracticeAreasPage() {
  const live = usePublicContent();
  const areas = live.practices;
  const [search, setSearch] = useState("");
  const filtered = areas.filter(p =>
    `${p.title} ${p.short}`.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(
    () =>
      setPageMeta(
        "Practice Areas",
        "Explore provisional practice-area descriptions and learn how to request a consultation."
      ),
    []
  );
  return (
    <>
      <PageHero
        eyebrow="Areas of counsel"
        title="Legal insight for consequential decisions."
        intro="The categories below demonstrate how the practice areas can be explored. The firm must confirm which services it actually offers before publication."
      />
      <section className="section">
        <div className="container">
          <DemoNotice>{demoNotice}</DemoNotice>
          <div className="search-box" style={{ margin: "26px 0 32px" }}>
            <Search size={17} />
            <input
              aria-label="Search practice areas"
              placeholder="Search practice areas"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="practice-grid">
            {filtered.map(item => (
              <article className="practice-card" key={item.slug}>
                <span className="eyebrow">Practice area</span>
                <h3>{item.title}</h3>
                <p>{item.short}</p>
                <Link
                  className="text-link"
                  href={`/practice-areas/${item.slug}`}
                >
                  Explore service <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              No practice areas match your search.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function PracticeDetailPage() {
  const live = usePublicContent();
  const { slug = "" } = useParams();
  const item = live.practices.find(p => p.slug === slug);
  useEffect(() => {
    if (!item && live.isLoading) return;
    setPageMeta(
      item ? item.title : "Practice area not found",
      item?.short ?? "This practice-area page could not be found.",
      !item || Boolean(item.demo)
    );
  }, [item, live.isLoading]);
  if (!item) return live.isLoading ? <ContentLoading /> : <MissingPage />;
  return (
    <>
      <PageHero
        eyebrow="Practice area · demo"
        title={item.title}
        intro={item.short}
      />
      <section className="section-sm">
        <div className="container">
          {item.image ? (
            <img
              className="practice-detail-image"
              src={item.image}
              alt={`Editorial image representing ${item.title}`}
              loading="lazy"
            />
          ) : (
            <div className="practice-visual">
              <span className="eyebrow">
                LEGAL AID LEGAL SERVICES LLC · LEGAL PRACTICE
              </span>
              <div className="practice-visual-seal">
                <Scale size={58} strokeWidth={1} />
              </div>
              <strong className="serif">{item.title}</strong>
              <span className="practice-visual-caption">
                Measured counsel · Clear direction
              </span>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <DemoNotice>{demoNotice}</DemoNotice>
            <h2>Overview</h2>
            <p>{item.overview}</p>
            <h2>Legal services illustrated</h2>
            <ul>
              {item.services.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Common client questions</h2>
            <ul>
              {item.challenges.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>How counsel may assist</h2>
            <ul>
              {item.assistance.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Frequently asked questions</h2>
            {item.faqs.map(f => (
              <div className="faq-item" key={f.question}>
                <h3>{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
          <aside className="detail-sidebar">
            <span className="eyebrow">Next step</span>
            <h3>Discuss your situation.</h3>
            <p className="body-copy">
              A short initial conversation can help identify the right
              questions. Please avoid sending confidential documents or
              sensitive details through the general form.
            </p>
            <Link className="btn" href="/consultation">
              Request a consultation <ArrowUpRight size={14} />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

export function AttorneysPage() {
  const people = usePublicContent().attorneys;
  useEffect(
    () =>
      setPageMeta(
        "Our Attorneys",
        "Meet the LEGAL AID LEGAL SERVICES LLC attorney team and review professional profiles."
      ),
    []
  );
  return (
    <>
      <PageHero
        eyebrow="People & perspective"
        title="Counsel grounded in experience."
        intro="Meet the professionals represented in this demonstration attorney directory. Profiles and credentials must be verified before use."
      />
      <section className="section">
        <div className="container">
          <DemoNotice>{demoNotice}</DemoNotice>
          <div className="article-grid" style={{ marginTop: 30 }}>
            {people.map(person => (
              <article className="article-card" key={person.slug}>
                <Link href={`/attorneys/${person.slug}`}>
                  <img
                    src={person.photo}
                    alt={`Illustrative portrait of fictional demo attorney ${person.name}`}
                    loading="lazy"
                  />
                </Link>
                <div className="article-card-body">
                  <span className="eyebrow">{person.title}</span>
                  <h3>
                    <Link href={`/attorneys/${person.slug}`}>
                      {person.name}
                    </Link>
                  </h3>
                  <p>
                    <strong>{person.specialty}</strong>
                  </p>
                  <p>{person.bio}</p>
                  <Link
                    className="text-link"
                    href={`/attorneys/${person.slug}`}
                  >
                    View full profile <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function AttorneyDetailPage() {
  const live = usePublicContent();
  const people = live.attorneys;
  const { slug = "" } = useParams();
  const person = people.find(a => a.slug === slug);
  useEffect(() => {
    if (!person && live.isLoading) return;
    setPageMeta(
      person ? person.name : "Attorney profile not found",
      person?.bio ?? "This attorney profile could not be found.",
      !person || Boolean(person.demo)
    );
  }, [person, live.isLoading]);
  if (!person) return live.isLoading ? <ContentLoading /> : <MissingPage />;
  return (
    <>
      <PageHero
        eyebrow="Attorney profile · demo"
        title={person.name}
        intro={person.title}
      />
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <DemoNotice>{demoNotice}</DemoNotice>
            <h2>Professional biography</h2>
            <p>{person.fullBio}</p>
            <h2>Education</h2>
            <ul>
              {person.education.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Qualifications &amp; memberships</h2>
            <ul>
              {person.credentials.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Practice areas</h2>
            <p>{person.specialty} (demonstration; confirm actual offerings)</p>
            <h2>Professional experience</h2>
            <ul>
              {person.experience.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Languages</h2>
            <ul>
              {person.languages.map(x => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <aside className="detail-sidebar">
            <img
              src={person.photo}
              alt={`Illustrative fictional demo portrait of ${person.name}`}
              style={{
                width: "100%",
                aspectRatio: "4/5",
                objectFit: "cover",
                marginBottom: 20,
              }}
            />
            <span className="eyebrow">{person.specialty}</span>
            <p className="body-copy">
              For a consultation request, share only a brief, non-sensitive
              summary.
            </p>
            <Link className="btn" href="/consultation">
              Request a consultation
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

export function InsightsPage() {
  const live = usePublicContent();
  const posts = live.articles;
  const cats = Array.from(new Set([...categories, ...live.categories]));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(6);
  const filtered = useMemo(
    () =>
      posts.filter(
        a =>
          (category === "All" || a.category === category) &&
          `${a.title} ${a.excerpt} ${a.category}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [posts, query, category]
  );
  useEffect(
    () =>
      setPageMeta(
        "Legal Insights",
        "Explore legal updates and general educational resources from LEGAL AID LEGAL SERVICES LLC."
      ),
    []
  );
  return (
    <>
      <PageHero
        eyebrow="Insights & resources"
        title="Ideas for better-informed decisions."
        intro="General legal education to help frame useful questions. Articles are illustrative and must not be treated as legal advice."
      />
      <section className="section">
        <div className="container">
          {posts[0] ? (
            <div className="article-layout" style={{ marginBottom: 50 }}>
              <span className="eyebrow">Featured article</span>
              <h2
                className="serif"
                style={{
                  fontSize: "clamp(2.3rem,5vw,4rem)",
                  color: "#10243a",
                  lineHeight: 1.1,
                }}
              >
                {posts[0].title}
              </h2>
              <p className="body-copy">{posts[0].excerpt}</p>
              <Link className="text-link" href={`/insights/${posts[0].slug}`}>
                Read featured article <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              There are no published insights at the moment.
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div className="filter-row" aria-label="Article categories">
              <button
                className={`filter-pill ${category === "All" ? "selected" : ""}`}
                onClick={() => setCategory("All")}
              >
                All topics
              </button>
              {cats.map(c => (
                <button
                  key={c}
                  className={`filter-pill ${category === c ? "selected" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="search-box">
              <Search size={16} />
              <input
                aria-label="Search articles"
                placeholder="Search insights"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="article-grid">
            {filtered.slice(0, visible).map(article => (
              <article className="article-card" key={article.slug}>
                <Link href={`/insights/${article.slug}`}>
                  <img
                    src={article.image}
                    alt="Editorial illustration for legal insights article"
                    loading="lazy"
                  />
                </Link>
                <div className="article-card-body">
                  <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
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
          {filtered.length === 0 && (
            <div className="empty-state">
              No articles match this search and category.
            </div>
          )}
          {visible < filtered.length && (
            <div className="load-more">
              <button
                className="btn btn-outline"
                onClick={() => setVisible(v => v + 6)}
              >
                Load more insights <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function ArticleDetailPage() {
  const live = usePublicContent();
  const posts = live.articles;
  const { slug = "" } = useParams();
  const article = posts.find(a => a.slug === slug);
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (!article && live.isLoading) return;
    setPageMeta(
      article ? article.title : "Article not found",
      article?.excerpt ?? "This article could not be found.",
      !article || Boolean(article.demo)
    );
  }, [article, live.isLoading]);
  if (!article) return live.isLoading ? <ContentLoading /> : <MissingPage />;
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
    } catch {
      setShared(false);
    }
  };
  return (
    <>
      <section className="section-sm">
        <div className="container article-layout">
          <Link className="text-link" href="/insights">
            <ArrowLeft size={14} /> Back to insights
          </Link>
          <div style={{ marginTop: 24 }} className="article-meta">
            <span className="article-category">{article.category}</span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(2.7rem,6vw,5rem)",
              lineHeight: 1.07,
              color: "#10243a",
              margin: "18px 0",
            }}
          >
            {article.title}
          </h1>
          <p className="body-copy">By {article.author}</p>
          <img
            className="article-hero-img"
            src={article.image}
            alt="Editorial image for the legal educational article"
          />
          <DemoNotice>
            This article is general educational information, not legal advice.
            Verify all legal content before publication.
          </DemoNotice>
          <div className="share-row">
            <button className="small-action" onClick={share}>
              <Copy size={14} />
              {shared ? "Link copied" : "Copy link"}
            </button>
            <a
              className="small-action"
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            >
              <Share2 size={14} />
              Share on LinkedIn
            </a>
          </div>
          <div className="article-content">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="cta-band" style={{ marginTop: 45, padding: 30 }}>
            <h2
              className="serif"
              style={{ fontSize: "2rem", color: "#10243a" }}
            >
              Have a question about your situation?
            </h2>
            <Link className="btn btn-navy" href="/consultation">
              Request a consultation <ArrowUpRight size={14} />
            </Link>
          </div>
          {posts.filter(post => post.slug !== article.slug).slice(0, 2).length >
            0 && (
            <div style={{ marginTop: 48 }}>
              <span className="eyebrow">Continue reading</span>
              <h2
                className="serif"
                style={{
                  fontSize: "2.2rem",
                  color: "#10243a",
                  margin: "12px 0 24px",
                }}
              >
                Related insights
              </h2>
              <div className="article-grid">
                {posts
                  .filter(post => post.slug !== article.slug)
                  .slice(0, 2)
                  .map(post => (
                    <article className="article-card" key={post.slug}>
                      <Link href={`/insights/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={`Editorial image for ${post.title}`}
                          loading="lazy"
                        />
                      </Link>
                      <div className="article-card-body">
                        <span className="article-category">
                          {post.category}
                        </span>
                        <h3>
                          <Link href={`/insights/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p>{post.excerpt}</p>
                        <Link
                          className="text-link"
                          href={`/insights/${post.slug}`}
                        >
                          Read article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  min,
  wide = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  wide?: boolean;
}) {
  return (
    <div className={`form-field${wide ? " full" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
      />
    </div>
  );
}
function Status({
  state,
  message,
}: {
  state: "success" | "error";
  message: string;
}) {
  return (
    <div className={`form-status ${state}`} role="status">
      {state === "success" ? (
        <Check size={17} style={{ display: "inline", marginRight: 7 }} />
      ) : null}
      {message}
    </div>
  );
}

function SmsOptInCheckbox({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <>
      <label className="checkbox-line" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          name="smsConsent"
          value="yes"
          checked={checked}
          onChange={event => onChange(event.target.checked)}
        />
        <span>
          Optional: I confirm the number provided is a mobile number and agree
          to recurring SMS customer-care messages from LEGAL AID LEGAL SERVICES
          LLC if messaging is configured.
        </span>
      </label>
      <small>
        Consent is not a condition of purchase or of submitting this request.
        Message frequency varies; message and data rates may apply. Automated
        texts are not active yet. Read the{" "}
        <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </small>
    </>
  );
}

export function ConsultationPage() {
  const practiceOptions = usePublicContent().practices.map(p => p.title);
  const [status, setStatus] = useState<{
    state: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);
  useEffect(
    () =>
      setPageMeta(
        "Book a Consultation",
        "Request a consultation with LEGAL AID LEGAL SERVICES LLC. A request is not confirmed until approved by the firm."
      ),
    []
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setPending(true);
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/public/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "We could not submit your request. Please try again."
        );
      setStatus({
        state: "success",
        message:
          "Your consultation request has been received. It is not a confirmed appointment until the firm reviews and approves it. We will follow up using your preferred contact method." +
          (data.smsConsentRecorded
            ? " Your optional SMS preference was recorded; automated text delivery is not active yet."
            : ""),
      });
      form.reset();
      setSmsOptIn(false);
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Submission failed. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <PageHero
        eyebrow="Consultation request"
        title="A clear first step."
        intro="Tell us how to reach you and share a brief, non-sensitive summary. A request is not an appointment until approved by the firm."
      />
      <section className="section">
        <div className="container form-layout">
          <aside className="form-aside">
            <span className="eyebrow">Start a conversation</span>
            <h2>Request a consultation.</h2>
            <p>
              We will review your request and contact you regarding
              availability. Please do not include confidential documents, highly
              sensitive details, or information that would create risk if
              received through a general website form.
            </p>
            <div className="contact-cards">
              <div className="contact-card">
                <CalendarDays />
                <div>
                  <h3>Preferred date &amp; time</h3>
                  <p>
                    Request a suitable day and time. The firm will confirm
                    availability.
                  </p>
                </div>
              </div>
              <div className="contact-card">
                <ShieldIcon />
                <div>
                  <h3>Privacy first</h3>
                  <p>
                    Only share a short overview until appropriate professional
                    arrangements are confirmed.
                  </p>
                </div>
              </div>
            </div>
          </aside>
          <form className="form-panel" onSubmit={submit}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Consultation details
            </div>
            {status && <Status {...status} />}
            <div className="form-grid">
              <Field
                label="Full name"
                name="fullName"
                placeholder="Your name"
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
              <Field
                label={smsOptIn ? "Mobile phone number" : "Phone number"}
                name="phone"
                type="tel"
                placeholder={
                  smsOptIn
                    ? "Mobile number for SMS; include country code"
                    : "Include country code"
                }
              />
              <Field
                label="Preferred consultation date"
                name="preferredDate"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
              />
              <div className="form-field">
                <label htmlFor="preferredTime">
                  Preferred consultation time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {[
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                  ].map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="practiceArea">Legal practice area *</label>
                <select
                  id="practiceArea"
                  name="practiceArea"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an area
                  </option>
                  {practiceOptions.map(x => (
                    <option key={x}>{x}</option>
                  ))}
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="consultationType">Consultation type *</label>
                <select
                  id="consultationType"
                  name="consultationType"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  <option>In-Person Consultation</option>
                  <option>Virtual Consultation</option>
                  <option>Telephone Consultation</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="contactMethod">
                  Preferred contact method *
                </label>
                <select
                  id="contactMethod"
                  name="contactMethod"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select method
                  </option>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="legalNeeds">
                  Brief description of legal needs *
                </label>
                <textarea
                  id="legalNeeds"
                  name="legalNeeds"
                  required
                  minLength={10}
                  maxLength={1200}
                  placeholder="Share a brief, general outline only. Do not include confidential documents or highly sensitive information."
                />
              </div>
              <div className="hidden-field" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="form-field full">
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    value="yes"
                    required
                  />
                  <span>
                    I have read the privacy notice and understand that
                    submitting this request does not create an attorney-client
                    relationship. I will not send highly sensitive or
                    confidential information. *
                  </span>
                </label>
                <small>
                  Read the <Link href="/privacy">Privacy Policy</Link>.
                </small>
              </div>
              <div className="form-field full">
                <SmsOptInCheckbox
                  id="smsConsultationOptIn"
                  checked={smsOptIn}
                  onChange={setSmsOptIn}
                />
              </div>
              {smsOptIn && (
                <Field
                  label="Mailing address"
                  name="mailingAddress"
                  placeholder="Street, city, state/province, postal code"
                  wide
                />
              )}
              <div className="form-field full">
                <button className="btn" type="submit" disabled={pending}>
                  {pending ? "Submitting…" : "Submit consultation request"}{" "}
                  <ArrowRight size={15} />
                </button>
                <small style={{ color: "#747b80", lineHeight: 1.6 }}>
                  We will confirm receipt on this page. Your appointment is
                  pending until the firm approves it.
                </small>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
function ShieldIcon() {
  return (
    <span style={{ color: "#b99a62" }}>
      <Check size={20} />
    </span>
  );
}

export function ContactPage() {
  const [status, setStatus] = useState<{
    state: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const settings = trpc.publicSite.settings.useQuery(undefined, {
    retry: false,
  });
  useEffect(
    () =>
      setPageMeta(
        "Contact Us",
        "Contact LEGAL AID LEGAL SERVICES LLC to discuss general inquiries or request a consultation."
      ),
    []
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setPending(true);
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "We could not send your message.");
      setStatus({
        state: "success",
        message:
          "Thank you. Your message has been received. We will respond using the contact details you provided." +
          (data.smsConsentRecorded
            ? " Your optional SMS preference was recorded; automated text delivery is not active yet."
            : ""),
      });
      form.reset();
      setSmsOptIn(false);
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Submission failed. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }
  const cfg = settings.data?.values ?? {};
  const phoneNumbers = getPhoneNumbers(cfg.phone);
  return (
    <>
      <PageHero
        eyebrow="Contact LEGAL AID LEGAL SERVICES LLC"
        title="A straightforward point of contact."
        intro="Reach out with a general inquiry or request a consultation. Please do not send confidential or highly sensitive information through this form."
      />
      <section className="section">
        <div className="container form-layout">
          <aside className="form-aside">
            <span className="eyebrow">Our office</span>
            <h2>We are here to listen.</h2>
            <p>
              For an initial inquiry, share only the information needed to
              understand how to respond. The business phone numbers and email
              below were supplied; a street address and office hours were not.
            </p>
            <div className="contact-cards">
              <div className="contact-card">
                <MapPin size={19} />
                <div>
                  <h3>Office address</h3>
                  <p>{cfg.officeAddress || businessAddressNotice}</p>
                </div>
              </div>
              <div className="contact-card">
                <Phone size={19} />
                <div>
                  <h3>Telephone</h3>
                  <p>
                    {phoneNumbers.map(number => (
                      <span key={number} style={{ display: "block" }}>
                        <a href={phoneHref(number)}>{number}</a>
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="contact-card">
                <Mail size={19} />
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${cfg.email || businessEmail}`}>
                      {cfg.email || businessEmail}
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-card">
                <Clock3 size={19} />
                <div>
                  <h3>Business hours</h3>
                  <p>{cfg.hours || businessHoursNotice}</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <DemoNotice>
                Google Maps location will appear when the office address is
                verified.
              </DemoNotice>
            </div>
          </aside>
          <div>
            <form className="form-panel" onSubmit={submit}>
              <div className="eyebrow" style={{ marginBottom: 18 }}>
                Send a general message
              </div>
              {status && <Status {...status} />}
              <div className="form-grid">
                <Field label="Full name" name="fullName" />
                <Field label="Email" name="email" type="email" />
                <Field
                  label={smsOptIn ? "Mobile phone number" : "Phone number"}
                  name="phone"
                  type="tel"
                  required={smsOptIn}
                  placeholder={
                    smsOptIn
                      ? "Mobile number for SMS; include country code"
                      : "Optional unless opting into SMS"
                  }
                />
                <Field label="Subject" name="subject" />
                <div className="form-field full">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    placeholder="Please do not include confidential documents or highly sensitive information."
                  />
                </div>
                <div className="hidden-field" aria-hidden="true">
                  <label htmlFor="companyWebsite">Leave this field empty</label>
                  <input
                    id="companyWebsite"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="form-field full">
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      name="privacyConsent"
                      value="yes"
                      required
                    />
                    <span>
                      I have read the privacy notice. I understand that
                      submitting a general inquiry does not automatically
                      establish an attorney-client relationship. *
                    </span>
                  </label>
                  <small>
                    Read the <Link href="/privacy">Privacy Policy</Link>.
                  </small>
                </div>
                <div className="form-field full">
                  <SmsOptInCheckbox
                    id="smsContactOptIn"
                    checked={smsOptIn}
                    onChange={setSmsOptIn}
                  />
                </div>
                {smsOptIn && (
                  <Field
                    label="Mailing address"
                    name="mailingAddress"
                    placeholder="Street, city, state/province, postal code"
                    wide
                  />
                )}
                <div className="form-field full">
                  <button className="btn" type="submit" disabled={pending}>
                    {pending ? "Sending…" : "Send message"}{" "}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </form>
            <div style={{ marginTop: 20 }} className="map-placeholder">
              {cfg.mapQuery ? (
                <iframe
                  title="Map showing the firm's verified office location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(cfg.mapQuery)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div>
                  <MapPin size={25} />
                  <p>
                    Office map is awaiting a verified address. Once configured,
                    this area will display the firm's map location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { PolicyPage } from "@/pages/PolicyPage";

function ContentLoading() {
  return (
    <section className="section">
      <div className="container empty-state" role="status">
        Loading published content…
      </div>
    </section>
  );
}

export function MissingPage() {
  return <NotFound />;
}
