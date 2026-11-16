import { FormEvent, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  FileText,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  Save,
  ShieldCheck,
  UploadCloud,
  Users,
  BriefcaseBusiness,
  Settings,
  CalendarClock,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { demoNotice } from "@/lib/site";
import { DemoNotice } from "@/components/site/SiteShell";

const tabs = [
  { id: "overview", label: "Overview", icon: ShieldCheck },
  { id: "consultations", label: "Consultations", icon: CalendarClock },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "attorneys", label: "Attorneys", icon: Users },
  { id: "practices", label: "Practice areas", icon: BriefcaseBusiness },
  { id: "articles", label: "Insights", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminPage() {
  const auth = useAuth();
  if (auth.loading)
    return (
      <section className="section">
        <div className="container empty-state">
          <LoaderCircle
            className="animate-spin"
            style={{ margin: "auto auto 10px" }}
          />
          Checking administrator access…
        </div>
      </section>
    );
  if (!auth.user)
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className="admin-panel">
            <span className="eyebrow">Secure administrator access</span>
            <h1
              className="serif"
              style={{ fontSize: "3rem", color: "#10243a" }}
            >
              Sign in to continue.
            </h1>
            <p className="body-copy">
              The dashboard is restricted to authorized administrators. Sign in
              with your Manus account. Access is determined by the server-side
              administrator role; development bypasses are not enabled.
            </p>
            <button className="btn" onClick={() => startLogin()}>
              Sign in securely <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>
    );
  if (auth.user.role !== "admin")
    return <BootstrapAccess onLogout={auth.logout} />;
  return <AdminPanel onLogout={auth.logout} />;
}

function BootstrapAccess({ onLogout }: { onLogout: () => Promise<void> }) {
  const status = trpc.admin.bootstrapStatus.useQuery(undefined, {
    retry: false,
  });
  const utils = trpc.useUtils();
  const [code, setCode] = useState("");
  const claim = trpc.admin.claimBootstrap.useMutation({
    onSuccess: async () => {
      toast.success("Administrator access is now enabled for this account.");
      setCode("");
      await utils.auth.me.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="admin-panel">
          <span className="eyebrow">Access restricted</span>
          <h1 className="serif" style={{ fontSize: "3rem", color: "#10243a" }}>
            Administrator access required.
          </h1>
          <p className="body-copy">
            Your account is signed in but is not yet an administrator. If you
            are the firm's designated first administrator, claim access with the
            one-time setup code configured for this project. A regular sign-in
            alone never grants administrator rights.
          </p>
          {status.isLoading ? (
            <Loading />
          ) : status.error ? (
            <ErrorBox message={status.error.message} />
          ) : status.data?.available && !status.data.claimed ? (
            <form
              className="form-grid"
              onSubmit={e => {
                e.preventDefault();
                claim.mutate({ code });
              }}
            >
              <div className="form-field full">
                <label htmlFor="bootstrapCode">
                  One-time administrator setup code
                </label>
                <input
                  id="bootstrapCode"
                  type="password"
                  minLength={32}
                  maxLength={256}
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <small>
                  At least 32 characters. The code is checked server-side and
                  can be used only once.
                </small>
              </div>
              <div className="form-field full">
                <button className="btn" disabled={claim.isPending}>
                  {claim.isPending
                    ? "Claiming access…"
                    : "Claim administrator access"}{" "}
                  <ShieldCheck size={15} />
                </button>
              </div>
            </form>
          ) : (
            <div className="demo-banner">
              {status.data?.claimed
                ? "Administrator setup has already been claimed. Contact the authorized site administrator if you need access."
                : "No bootstrap code is configured. A project administrator must configure the owner identity or set up the one-time protected claim."}
            </div>
          )}
          <button
            className="btn btn-outline"
            style={{ marginTop: 18 }}
            onClick={() => onLogout()}
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => Promise<void> }) {
  const [tab, setTab] = useState("overview");
  return (
    <div className="admin-wrap">
      <div className="container">
        <div className="admin-top">
          <div>
            <span className="eyebrow">Private administration</span>
            <h1>LEGAL AID LEGAL SERVICES LLC Dashboard</h1>
            <p style={{ margin: 0, color: "#69737b", fontSize: ".82rem" }}>
              Confidential inquiries are visible only to authorized
              administrators.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => onLogout()}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
        <div className="demo-banner" style={{ marginBottom: 18 }}>
          Practice offerings, attorney credentials, and jurisdiction remain
          unverified. SMS delivery is not active until a messaging provider is
          connected and reviewed.
        </div>
        <nav className="admin-tabs" aria-label="Admin sections">
          {tabs.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`admin-tab ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <Icon
                  size={14}
                  style={{ verticalAlign: "-2px", marginRight: 6 }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
        <section className="admin-panel">
          {tab === "overview" && <Overview />}
          {tab === "consultations" && <ConsultationManager />}
          {tab === "messages" && <MessageManager />}
          {tab === "attorneys" && <AttorneyManager />}
          {tab === "practices" && <PracticeManager />}
          {tab === "articles" && <ArticleManager />}
          {tab === "settings" && <SettingsManager />}
        </section>
      </div>
    </div>
  );
}

function Overview() {
  const q = trpc.admin.dashboard.useQuery(undefined, { retry: false });
  const email = trpc.admin.emailStatus.useQuery(undefined, { retry: false });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={q.error.message} />;
  const x = q.data!;
  return (
    <>
      <div className="admin-kpis">
        {[
          ["Total requests", x.consultations],
          ["Pending", x.pending],
          ["Approved", x.approved],
          ["Published articles", x.publishedArticles],
        ].map(([label, value]) => (
          <div className="admin-kpi" key={String(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="detail-grid">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.7rem", color: "#10243a" }}
          >
            Recent contact messages
          </h2>
          {x.recentMessages.length ? (
            x.recentMessages.map(m => (
              <div className="contact-card" key={m.id}>
                <Mail size={18} />
                <div>
                  <h3>{m.subject}</h3>
                  <p>
                    {m.fullName} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="status-chip">{m.status}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">No messages have been received.</div>
          )}
        </div>
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.7rem", color: "#10243a" }}
          >
            Operational setup
          </h2>
          <div className="contact-card">
            <Mail size={18} />
            <div>
              <h3>Email delivery</h3>
              <p>
                {email.data?.configured
                  ? "Provider settings detected"
                  : "Not configured — forms still save securely and confirm on-screen."}
              </p>
            </div>
          </div>
          <div className="contact-card">
            <MessageSquare size={18} />
            <div>
              <h3>SMS delivery</h3>
              <p>
                Not connected — opt-in preferences are recorded, but automated
                text messages are not sent.
              </p>
            </div>
          </div>
          <div className="contact-card">
            <ShieldCheck size={18} />
            <div>
              <h3>Access protection</h3>
              <p>Manus OAuth login with server-side admin role checks.</p>
            </div>
          </div>
          <div className="contact-card">
            <FileText size={18} />
            <div>
              <h3>Policy review</h3>
              <p>
                Jurisdiction-specific privacy and professional-conduct language
                requires firm review.
              </p>
            </div>
          </div>
          <div className="contact-card">
            <ShieldCheck size={18} />
            <div>
              <h3>Inquiry retention</h3>
              <p>
                Define and implement the firm's jurisdiction-appropriate
                retention and deletion schedule before accepting real personal
                or legal-matter information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function Loading() {
  return (
    <div className="empty-state">
      <LoaderCircle
        className="animate-spin"
        style={{ margin: "auto auto 10px" }}
      />
      Loading securely…
    </div>
  );
}
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="form-status error" role="alert">
      {message}
    </div>
  );
}

function ConsultationManager() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const list = trpc.consultation.list.useQuery(
    {
      query: query || undefined,
      status: status as
        | "all"
        | "pending"
        | "approved"
        | "declined"
        | "completed"
        | "cancelled",
    },
    { retry: false }
  );
  const update = trpc.consultation.update.useMutation({
    onSuccess: () => list.refetch(),
    onError: e => toast.error(e.message),
  });
  const optOut = trpc.consultation.optOutSms.useMutation({
    onSuccess: () => {
      list.refetch();
      toast.success("SMS opt-out recorded and mailing address cleared.");
    },
    onError: e => toast.error(e.message),
  });
  const remove = trpc.consultation.delete.useMutation({
    onSuccess: () => {
      list.refetch();
      toast.success("Consultation record deleted.");
    },
    onError: e => toast.error(e.message),
  });
  const [notes, setNotes] = useState<Record<number, string>>({});
  if (list.isLoading) return <Loading />;
  if (list.error) return <ErrorBox message={list.error.message} />;
  return (
    <>
      <div className="admin-top">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.8rem", color: "#10243a", margin: 0 }}
          >
            Consultation requests
          </h2>
          <p style={{ color: "#717b80", fontSize: ".8rem" }}>
            Requests remain pending until the firm approves them.
          </p>
        </div>
        <div className="admin-tools">
          <select
            aria-label="Filter consultation status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            {["pending", "approved", "declined", "completed", "cancelled"].map(
              s => (
                <option key={s}>{s}</option>
              )
            )}
          </select>
          <label className="search-box">
            <Search size={15} />
            <input
              aria-label="Search consultations"
              placeholder="Name, email, area"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Request</th>
              <th>Preferred</th>
              <th>Status / notes</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {list.data?.map(r => (
              <tr key={r.id}>
                <td>
                  <strong>{r.fullName}</strong>
                  <br />
                  {r.email}
                  <br />
                  {r.phone}
                  <br />
                  <small>{r.contactMethod} preferred</small>
                  {r.smsConsent && (
                    <small style={{ display: "block", marginTop: 5 }}>
                      SMS customer-care opt-in recorded
                      {r.smsConsentAt
                        ? ` · ${new Date(r.smsConsentAt).toLocaleString()}`
                        : ""}
                    </small>
                  )}
                  {r.smsConsent && r.mailingAddress && (
                    <small style={{ display: "block", marginTop: 4 }}>
                      SMS mailing address: {r.mailingAddress}
                    </small>
                  )}
                  {r.smsOptOutAt && (
                    <small style={{ display: "block", marginTop: 4 }}>
                      SMS opt-out recorded ·{" "}
                      {new Date(r.smsOptOutAt).toLocaleString()}
                    </small>
                  )}
                </td>
                <td>
                  {r.practiceArea}
                  <br />
                  {r.consultationType}
                  <details>
                    <summary>Brief description</summary>
                    <p style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
                      {r.legalNeeds}
                    </p>
                  </details>
                </td>
                <td>
                  {r.preferredDate}
                  <br />
                  {r.preferredTime}
                  <br />
                  <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                </td>
                <td>
                  <span className={`status-chip ${r.status}`}>{r.status}</span>
                  <textarea
                    aria-label={`Internal notes for ${r.fullName}`}
                    placeholder="Private internal note"
                    value={notes[r.id] ?? r.internalNotes ?? ""}
                    onChange={e =>
                      setNotes(n => ({ ...n, [r.id]: e.target.value }))
                    }
                    style={{
                      display: "block",
                      marginTop: 8,
                      width: 200,
                      minHeight: 48,
                      border: "1px solid #e8e8e5",
                      padding: 7,
                      fontSize: 12,
                    }}
                  />
                </td>
                <td>
                  <div className="admin-tools">
                    <select
                      aria-label={`Change status for ${r.fullName}`}
                      value={r.status}
                      onChange={e =>
                        update.mutate({
                          id: r.id,
                          status: e.target.value as
                            | "pending"
                            | "approved"
                            | "declined"
                            | "completed"
                            | "cancelled",
                          internalNotes: notes[r.id] ?? r.internalNotes ?? "",
                        })
                      }
                    >
                      {[
                        "pending",
                        "approved",
                        "declined",
                        "completed",
                        "cancelled",
                      ].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        update.mutate({
                          id: r.id,
                          status: r.status,
                          internalNotes: notes[r.id] ?? r.internalNotes ?? "",
                        })
                      }
                    >
                      <Save size={13} /> Save notes
                    </button>
                    {r.smsConsent && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Record this customer's SMS opt-out and clear the SMS mailing address?"
                            )
                          )
                            optOut.mutate({ id: r.id });
                        }}
                      >
                        Record SMS opt-out
                      </button>
                    )}
                    <button
                      type="button"
                      className="small-action"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Permanently delete this consultation record and its personal data?"
                          )
                        )
                          remove.mutate({ id: r.id });
                      }}
                    >
                      <Trash2 size={13} /> Delete record
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.data?.length && (
          <div className="empty-state">
            No consultation requests match these filters.
          </div>
        )}
      </div>
    </>
  );
}

function MessageManager() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const list = trpc.admin.messages.useQuery(
    {
      query: query || undefined,
      status: status as "all" | "new" | "read" | "closed",
    },
    { retry: false }
  );
  const update = trpc.admin.updateMessage.useMutation({
    onSuccess: () => list.refetch(),
    onError: e => toast.error(e.message),
  });
  const optOut = trpc.admin.optOutMessage.useMutation({
    onSuccess: () => {
      list.refetch();
      toast.success("SMS opt-out recorded and mailing address cleared.");
    },
    onError: e => toast.error(e.message),
  });
  const remove = trpc.admin.deleteMessage.useMutation({
    onSuccess: () => {
      list.refetch();
      toast.success("Contact record deleted.");
    },
    onError: e => toast.error(e.message),
  });
  if (list.isLoading) return <Loading />;
  if (list.error) return <ErrorBox message={list.error.message} />;
  return (
    <>
      <div className="admin-top">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.8rem", color: "#10243a", margin: 0 }}
          >
            Contact messages
          </h2>
          <p style={{ color: "#717b80", fontSize: ".8rem" }}>
            Private messages are available only to authorized administrators.
          </p>
        </div>
        <div className="admin-tools">
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {["new", "read", "closed"].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <label className="search-box">
            <Search size={14} />
            <input
              placeholder="Search messages"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.data?.map(m => (
              <tr key={m.id}>
                <td>
                  {m.fullName}
                  <br />
                  {m.email}
                  <br />
                  {m.phone}
                  {m.smsConsent && (
                    <small style={{ display: "block", marginTop: 5 }}>
                      SMS customer-care opt-in recorded
                      {m.smsConsentAt
                        ? ` · ${new Date(m.smsConsentAt).toLocaleString()}`
                        : ""}
                    </small>
                  )}
                  {m.smsConsent && m.mailingAddress && (
                    <small style={{ display: "block", marginTop: 4 }}>
                      SMS mailing address: {m.mailingAddress}
                    </small>
                  )}
                  {m.smsOptOutAt && (
                    <small style={{ display: "block", marginTop: 4 }}>
                      SMS opt-out recorded ·{" "}
                      {new Date(m.smsOptOutAt).toLocaleString()}
                    </small>
                  )}
                </td>
                <td>{m.subject}</td>
                <td style={{ whiteSpace: "pre-wrap", maxWidth: 360 }}>
                  {m.message}
                </td>
                <td>{new Date(m.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    value={m.status}
                    onChange={e =>
                      update.mutate({
                        id: m.id,
                        status: e.target.value as "new" | "read" | "closed",
                      })
                    }
                  >
                    {["new", "read", "closed"].map(x => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  <div className="admin-tools" style={{ marginTop: 8 }}>
                    {m.smsConsent && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Record this customer's SMS opt-out and clear the SMS mailing address?"
                            )
                          )
                            optOut.mutate({ id: m.id });
                        }}
                      >
                        Record SMS opt-out
                      </button>
                    )}
                    <button
                      type="button"
                      className="small-action"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Permanently delete this contact record and its personal data?"
                          )
                        )
                          remove.mutate({ id: m.id });
                      }}
                    >
                      <Trash2 size={13} /> Delete record
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.data?.length && (
          <div className="empty-state">No messages match these filters.</div>
        )}
      </div>
    </>
  );
}

function ContentQuery() {
  const content = trpc.admin.content.useQuery(undefined, { retry: false });
  return content;
}
function MediaField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Choose a JPEG, PNG, or WebP image under 5 MB.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/assets", {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
      toast.success("Image uploaded securely.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="form-field full">
      <label htmlFor={name}>{label} URL</label>
      <input
        name={name}
        id={name}
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="/manus-storage/..."
      />
      <label className="small-action" style={{ width: "fit-content" }}>
        <UploadCloud size={14} />
        {busy ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={upload}
          hidden
        />
      </label>
      {url && (
        <img
          src={url}
          alt="Selected media preview"
          style={{ width: 140, height: 90, objectFit: "cover" }}
        />
      )}
    </div>
  );
}
function lineArray(s: string) {
  return s
    .split("\n")
    .map(v => v.trim())
    .filter(Boolean);
}

function PracticeManager() {
  const q = ContentQuery();
  const save = trpc.admin.savePractice.useMutation({
    onSuccess: () => {
      q.refetch();
      toast.success("Practice area saved.");
    },
    onError: e => toast.error(e.message),
  });
  const [edit, setEdit] = useState<any>(null);
  const [show, setShow] = useState(false);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={q.error.message} />;
  const start = (p?: any) => {
    setEdit(
      p
        ? {
            ...p,
            services: (p.services || []).join("\n"),
            challenges: (p.challenges || []).join("\n"),
            assistance: (p.assistance || []).join("\n"),
            faqs: JSON.stringify(p.faqs || [], null, 2),
          }
        : {
            slug: "",
            title: "",
            summary: "",
            overview: "",
            services: "",
            challenges: "",
            assistance: "",
            faqs: "[]",
            imageUrl: "",
            published: false,
            isDemo: true,
          }
    );
    setShow(true);
  };
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let faqs = [];
    try {
      faqs = JSON.parse(String(fd.get("faqs") || "[]"));
    } catch {
      toast.error("FAQs must be valid JSON array.");
      return;
    }
    save.mutate({
      id: edit?.id,
      slug: String(fd.get("slug")),
      title: String(fd.get("title")),
      summary: String(fd.get("summary")),
      overview: String(fd.get("overview")),
      services: lineArray(String(fd.get("services"))),
      challenges: lineArray(String(fd.get("challenges"))),
      assistance: lineArray(String(fd.get("assistance"))),
      faqs,
      imageUrl: String(fd.get("imageUrl") || ""),
      published: fd.get("published") === "on",
      isDemo: fd.get("isDemo") === "on",
    });
    setShow(false);
  }
  return (
    <>
      <div className="admin-top">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.8rem", color: "#10243a", margin: 0 }}
          >
            Practice areas
          </h2>
          <p style={{ color: "#717b80", fontSize: ".8rem" }}>
            Create, edit and publish provisional or verified service
            information.
          </p>
        </div>
        <button className="btn" onClick={() => start()}>
          <Plus size={14} /> Add practice area
        </button>
      </div>
      {show && (
        <form className="admin-edit" onSubmit={submit}>
          <Field2 label="Title" name="title" defaultValue={edit.title} />
          <Field2 label="URL slug" name="slug" defaultValue={edit.slug} />
          <Field2
            label="Short summary"
            name="summary"
            defaultValue={edit.summary}
          />
          <Field2
            label="Overview"
            name="overview"
            defaultValue={edit.overview}
            area
          />
          <Field2
            label="Services (one per line)"
            name="services"
            defaultValue={edit.services}
            area
          />
          <Field2
            label="Common challenges (one per line)"
            name="challenges"
            defaultValue={edit.challenges}
            area
          />
          <Field2
            label="How the firm can assist (one per line)"
            name="assistance"
            defaultValue={edit.assistance}
            area
          />
          <Field2
            label="FAQs (JSON array of question/answer objects)"
            name="faqs"
            defaultValue={edit.faqs}
            area
          />
          <MediaField
            name="imageUrl"
            label="Practice area image"
            defaultValue={edit.imageUrl}
          />
          <Toggle
            name="published"
            label="Publish this practice area"
            defaultChecked={edit.published}
          />
          <Toggle
            name="isDemo"
            label="Mark as demo / unverified"
            defaultChecked={edit.isDemo}
          />
          <div className="admin-actions form-field full">
            <button className="btn" disabled={save.isPending}>
              <Save size={14} /> Save
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>URL</th>
              <th>Visibility</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.practices.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                </td>
                <td>{p.slug}</td>
                <td>
                  <span
                    className={`status-chip ${p.published ? "published" : "draft"}`}
                  >
                    {p.published ? "Published" : "Hidden"}
                  </span>{" "}
                  {p.isDemo && <span className="status-chip">Demo</span>}
                </td>
                <td>{p.summary}</td>
                <td>
                  <button className="small-action" onClick={() => start(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!q.data?.practices.length && (
          <div className="empty-state">
            No practice records in the CMS. Public demo content remains visible
            until verified entries are published.
          </div>
        )}
      </div>
    </>
  );
}

function AttorneyManager() {
  const q = ContentQuery();
  const save = trpc.admin.saveAttorney.useMutation({
    onSuccess: () => {
      q.refetch();
      toast.success("Attorney profile saved.");
    },
    onError: e => toast.error(e.message),
  });
  const [edit, setEdit] = useState<any>(null);
  const [show, setShow] = useState(false);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={q.error.message} />;
  const start = (p?: any) => {
    setEdit(
      p
        ? {
            ...p,
            education: (p.education || []).join("\n"),
            credentials: (p.credentials || []).join("\n"),
            experience: (p.experience || []).join("\n"),
            languages: (p.languages || []).join("\n"),
          }
        : {
            slug: "",
            fullName: "",
            title: "",
            specialty: "",
            summary: "",
            biography: "",
            education: "",
            credentials: "",
            experience: "",
            languages: "",
            photoUrl: "",
            published: false,
            isDemo: true,
          }
    );
    setShow(true);
  };
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    save.mutate({
      id: edit?.id,
      slug: String(d.get("slug")),
      fullName: String(d.get("fullName")),
      title: String(d.get("title")),
      specialty: String(d.get("specialty")),
      summary: String(d.get("summary")),
      biography: String(d.get("biography")),
      education: lineArray(String(d.get("education"))),
      credentials: lineArray(String(d.get("credentials"))),
      experience: lineArray(String(d.get("experience"))),
      languages: lineArray(String(d.get("languages"))),
      photoUrl: String(d.get("photoUrl") || ""),
      published: d.get("published") === "on",
      isDemo: d.get("isDemo") === "on",
    });
    setShow(false);
  }
  return (
    <>
      <div className="admin-top">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.8rem", color: "#10243a", margin: 0 }}
          >
            Attorney profiles
          </h2>
          <p style={{ color: "#717b80", fontSize: ".8rem" }}>
            Maintain multiple profiles, credentials, photos and publication
            status.
          </p>
        </div>
        <button className="btn" onClick={() => start()}>
          <Plus size={14} /> Add attorney
        </button>
      </div>
      {show && (
        <form className="admin-edit" onSubmit={submit}>
          <Field2
            label="Full name"
            name="fullName"
            defaultValue={edit.fullName}
          />
          <Field2
            label="Professional title"
            name="title"
            defaultValue={edit.title}
          />
          <Field2 label="URL slug" name="slug" defaultValue={edit.slug} />
          <Field2
            label="Specialization"
            name="specialty"
            defaultValue={edit.specialty}
          />
          <Field2
            label="Short biography"
            name="summary"
            defaultValue={edit.summary}
            area
          />
          <Field2
            label="Full professional biography"
            name="biography"
            defaultValue={edit.biography}
            area
          />
          <Field2
            label="Education (one per line)"
            name="education"
            defaultValue={edit.education}
            area
          />
          <Field2
            label="Qualifications / bar / memberships (one per line)"
            name="credentials"
            defaultValue={edit.credentials}
            area
          />
          <Field2
            label="Professional experience (one per line)"
            name="experience"
            defaultValue={edit.experience}
            area
          />
          <Field2
            label="Languages (one per line)"
            name="languages"
            defaultValue={edit.languages}
            area
          />
          <MediaField
            name="photoUrl"
            label="Professional photograph"
            defaultValue={edit.photoUrl}
          />
          <Toggle
            name="published"
            label="Publish profile"
            defaultChecked={edit.published}
          />
          <Toggle
            name="isDemo"
            label="Mark as demo / unverified"
            defaultChecked={edit.isDemo}
          />
          <div className="admin-actions form-field full">
            <button className="btn" disabled={save.isPending}>
              <Save size={14} /> Save profile
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Visibility</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.attorneys.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.fullName}</strong>
                  <br />
                  {p.title}
                </td>
                <td>{p.specialty}</td>
                <td>
                  <span
                    className={`status-chip ${p.published ? "published" : "draft"}`}
                  >
                    {p.published ? "Published" : "Hidden"}
                  </span>{" "}
                  {p.isDemo && <span className="status-chip">Demo</span>}
                </td>
                <td>
                  <button className="small-action" onClick={() => start(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!q.data?.attorneys.length && (
          <div className="empty-state">No attorney profiles in the CMS.</div>
        )}
      </div>
    </>
  );
}

function ArticleManager() {
  const q = ContentQuery();
  const save = trpc.admin.saveArticle.useMutation({
    onSuccess: () => {
      q.refetch();
      toast.success("Article saved.");
    },
    onError: e => toast.error(e.message),
  });
  const category = trpc.admin.saveCategory.useMutation({
    onSuccess: () => {
      q.refetch();
      toast.success("Category saved.");
    },
    onError: e => toast.error(e.message),
  });
  const [edit, setEdit] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [cat, setCat] = useState("");
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={q.error.message} />;
  const start = (p?: any) => {
    setEdit(
      p
        ? { ...p, content: (p.content || []).join("\n\n") }
        : {
            slug: "",
            title: "",
            category: "General Legal Education",
            excerpt: "",
            content: "",
            author: "LEGAL AID LEGAL SERVICES LLC Editorial Team",
            imageUrl: "",
            status: "draft",
            isDemo: true,
          }
    );
    setShow(true);
  };
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    save.mutate({
      id: edit?.id,
      slug: String(d.get("slug")),
      title: String(d.get("title")),
      category: String(d.get("category")),
      excerpt: String(d.get("excerpt")),
      content: String(d.get("content"))
        .split(/\n\s*\n/)
        .map(x => x.trim())
        .filter(Boolean),
      author: String(d.get("author")),
      imageUrl: String(d.get("imageUrl") || ""),
      status: d.get("status") === "published" ? "published" : "draft",
      isDemo: d.get("isDemo") === "on",
    });
    setShow(false);
  }
  return (
    <>
      <div className="admin-top">
        <div>
          <h2
            className="serif"
            style={{ fontSize: "1.8rem", color: "#10243a", margin: 0 }}
          >
            Insights &amp; articles
          </h2>
          <p style={{ color: "#717b80", fontSize: ".8rem" }}>
            Save drafts, publish articles and maintain categories.
          </p>
        </div>
        <button className="btn" onClick={() => start()}>
          <Plus size={14} /> New article
        </button>
      </div>
      <div className="admin-tools" style={{ marginBottom: 20 }}>
        <input
          aria-label="New article category"
          placeholder="Add a category"
          value={cat}
          onChange={e => setCat(e.target.value)}
        />
        <button
          onClick={() => {
            if (cat.trim()) category.mutate({ name: cat.trim() });
            setCat("");
          }}
        >
          Add category
        </button>
        {q.data?.categories.map(c => (
          <span className="tag" key={c.id}>
            {c.name}
          </span>
        ))}
      </div>
      {show && (
        <form className="admin-edit" onSubmit={submit}>
          <Field2
            label="Article title"
            name="title"
            defaultValue={edit.title}
          />
          <Field2 label="URL slug" name="slug" defaultValue={edit.slug} />
          <Field2
            label="Category"
            name="category"
            defaultValue={edit.category}
          />
          <Field2 label="Author" name="author" defaultValue={edit.author} />
          <Field2
            label="Short excerpt"
            name="excerpt"
            defaultValue={edit.excerpt}
            area
          />
          <Field2
            label="Article content (separate paragraphs with a blank line)"
            name="content"
            defaultValue={edit.content}
            area
          />
          <MediaField
            name="imageUrl"
            label="Featured image"
            defaultValue={edit.imageUrl}
          />
          <div className="form-field">
            <label htmlFor="status">Publication status</label>
            <select id="status" name="status" defaultValue={edit.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <Toggle
            name="isDemo"
            label="Mark as demo / unverified"
            defaultChecked={edit.isDemo}
          />
          <div className="admin-actions form-field full">
            <button className="btn" disabled={save.isPending}>
              <Save size={14} /> Save article
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.articles.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  <br />
                  {p.slug}
                </td>
                <td>{p.category}</td>
                <td>
                  <span className={`status-chip ${p.status}`}>{p.status}</span>{" "}
                  {p.isDemo && <span className="status-chip">Demo</span>}
                </td>
                <td>
                  <button className="small-action" onClick={() => start(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!q.data?.articles.length && (
          <div className="empty-state">
            No CMS articles yet. Public demo insights remain available until
            replaced.
          </div>
        )}
      </div>
    </>
  );
}

function SettingsManager() {
  const q = trpc.admin.settings.useQuery(undefined, { retry: false });
  const save = trpc.admin.saveSettings.useMutation({
    onSuccess: () => {
      q.refetch();
      toast.success("Website settings saved.");
    },
    onError: e => toast.error(e.message),
  });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox message={q.error.message} />;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const values = Object.fromEntries(d.entries());
    values.indexingEnabled =
      d.get("indexingEnabled") === "on" ? "true" : "false";
    save.mutate(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v)]))
    );
  }
  return (
    <>
      <h2
        className="serif"
        style={{ fontSize: "1.8rem", color: "#10243a", marginTop: 0 }}
      >
        Website settings
      </h2>
      <p className="body-copy">
        Use verified firm information only. Do not add secret keys here; email
        credentials belong in protected project settings.
      </p>
      <form className="admin-edit" onSubmit={submit}>
        <Field2
          label="Firm name"
          name="firmName"
          defaultValue={q.data?.firmName || "LEGAL AID LEGAL SERVICES LLC"}
        />
        <Field2
          label="Office address"
          name="officeAddress"
          defaultValue={q.data?.officeAddress || ""}
        />
        <Field2
          label="Official phone"
          name="phone"
          defaultValue={
            q.data?.phone || "(866) 356-7238 / (866) 838-0117 / (877) 217-9029"
          }
        />
        <Field2
          label="Official email"
          name="email"
          defaultValue={q.data?.email || "legaldocuments19803@yahoo.com"}
        />
        <Field2
          label="Business hours"
          name="hours"
          defaultValue={q.data?.hours || ""}
        />
        <Field2
          label="Public website URL (real domain only)"
          name="publicSiteUrl"
          defaultValue={q.data?.publicSiteUrl || ""}
        />
        <Field2
          label="Google Maps search query / verified address"
          name="mapQuery"
          defaultValue={q.data?.mapQuery || ""}
        />
        <Field2
          label="LinkedIn URL"
          name="linkedin"
          defaultValue={q.data?.linkedin || ""}
        />
        <Field2
          label="Instagram URL"
          name="instagram"
          defaultValue={q.data?.instagram || ""}
        />
        <Field2
          label="Facebook URL"
          name="facebook"
          defaultValue={q.data?.facebook || ""}
        />
        <Field2
          label="SEO title"
          name="seoTitle"
          defaultValue={
            q.data?.seoTitle ||
            "LEGAL AID LEGAL SERVICES LLC | Attorney & Law Firm"
          }
        />
        <Field2
          label="SEO description"
          name="seoDescription"
          defaultValue={q.data?.seoDescription || ""}
          area
        />
        <div className="form-field full">
          <Toggle
            name="indexingEnabled"
            label="Allow search-engine indexing after firm, legal and content verification"
            defaultChecked={q.data?.indexingEnabled === "true"}
          />
          <small>
            Disabled by default. When disabled, all pages are noindex and the
            sitemap is empty. Enable only after replacing or verifying demo
            identities, services, contact details, policies and article content,
            and after setting the real public URL.
          </small>
        </div>
        <div className="admin-actions form-field full">
          <button className="btn" disabled={save.isPending}>
            <Save size={14} /> Save settings
          </button>
        </div>
      </form>
      <div style={{ marginTop: 22 }}>
        <DemoNotice>{demoNotice}</DemoNotice>
      </div>
    </>
  );
}

function Field2({
  label,
  name,
  defaultValue,
  area = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  area?: boolean;
}) {
  return (
    <div className={`form-field ${area ? "full" : ""}`}>
      <label htmlFor={`admin-${name}`}>{label}</label>
      {area ? (
        <textarea
          id={`admin-${name}`}
          name={name}
          defaultValue={defaultValue}
          required
        />
      ) : (
        <input
          id={`admin-${name}`}
          name={name}
          defaultValue={defaultValue}
          required
        />
      )}
    </div>
  );
}
function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="checkbox-line">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}
