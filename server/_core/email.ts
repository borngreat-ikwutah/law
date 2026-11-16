type Mail = { to: string; subject: string; text: string };
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!
  );
export function emailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.EMAIL_FROM &&
      process.env.ADMIN_NOTIFICATION_EMAIL
  );
}
export async function sendConfiguredEmail(mail: Mail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from)
    return { sent: false as const, reason: "not_configured" as const };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(mail.text)}</div>`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.warn(
      `[Email] Provider rejected message (${response.status}) ${detail.slice(0, 240)}`
    );
    return { sent: false as const, reason: "provider_error" as const };
  }
  return { sent: true as const };
}
export async function notifyAdmin(subject: string, text: string) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) return { sent: false as const, reason: "not_configured" as const };
  return sendConfiguredEmail({ to, subject, text });
}
