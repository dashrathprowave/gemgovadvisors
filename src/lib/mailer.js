import { SITE } from "@/data/site";

/**
 * Sends the notification email for a new enquiry.
 *
 * Mail goes through the site's own mailbox over SMTP (Hostinger), so it arrives
 * from the real domain with no third-party quota. When SMTP is not configured
 * nothing is sent — the caller treats that as non-fatal, because the submission
 * has already been written to the database by then.
 */

const globalForMail = globalThis;

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

async function getTransporter() {
  if (!globalForMail.__gemAdvisorMailer) {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 465);

    globalForMail.__gemAdvisorMailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465 is implicit TLS; 587 starts plain and upgrades via STARTTLS.
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return globalForMail.__gemAdvisorMailer;
}

function recipients() {
  return (process.env.LEAD_NOTIFY_EMAIL || SITE.email)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

async function sendViaSmtp({ subject, html, replyTo }) {
  const transporter = await getTransporter();

  // The envelope sender has to be a real mailbox on the domain or the server
  // rejects it, so this defaults to the authenticating user rather than to
  // anything derived from the visitor's input.
  const from = process.env.SMTP_FROM || `"${SITE.name} Website" <${process.env.SMTP_USER}>`;

  await transporter.sendMail({ from, to: recipients(), replyTo, subject, html });
  return { sent: true, via: "smtp" };
}

export async function sendNotification({ subject, html, replyTo }) {
  if (!smtpConfigured()) return { sent: false, reason: "smtp_not_configured" };
  return sendViaSmtp({ subject, html, replyTo });
}

/** Which transport would be used, for `npm run db:check`. */
export function activeTransport() {
  return smtpConfigured() ? `SMTP (${process.env.SMTP_HOST})` : null;
}
