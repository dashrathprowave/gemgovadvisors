/**
 * Checks the SMTP settings and sends one test email.
 *
 *   node scripts/mail-test.mjs                 -> sends to LEAD_NOTIFY_EMAIL
 *   node scripts/mail-test.mjs you@gmail.com   -> sends somewhere else
 *
 * Run this before announcing the site, so a mail problem is found here rather
 * than by a customer whose enquiry never reached anyone.
 */
import nodemailer from "nodemailer";
import { loadEnv } from "./load-env.mjs";

await loadEnv();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, LEAD_NOTIFY_EMAIL } = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
  console.error(
    "\nSMTP is not configured.\n" +
      "Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD in .env.local, then run this again.\n"
  );
  process.exit(1);
}

const port = Number(SMTP_PORT || 465);
const to = process.argv[2] || LEAD_NOTIFY_EMAIL || SMTP_USER;

console.log(`\nHost:   ${SMTP_HOST}:${port} (${port === 465 ? "SSL" : "STARTTLS"})`);
console.log(`User:   ${SMTP_USER}`);
console.log(`To:     ${to}\n`);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

function explain(error) {
  const code = error.code || "";
  if (code === "EAUTH") {
    return "The username or password was rejected. Use the full email address as SMTP_USER and the mailbox password (not your hosting panel password).";
  }
  if (code === "ETIMEDOUT" || code === "ESOCKET" || code === "ECONNECTION") {
    return `Could not reach ${SMTP_HOST} on port ${port}. Many providers block 465 — try SMTP_PORT=587 in .env.local.`;
  }
  if (code === "EENVELOPE") {
    return "The server refused the from/to address. SMTP_FROM must be a real mailbox on your own domain.";
  }
  return "Check the settings in .env.local against your mail provider's SMTP page.";
}

try {
  process.stdout.write("Connecting and authenticating... ");
  await transporter.verify();
  console.log("OK");

  process.stdout.write("Sending test email...            ");
  const info = await transporter.sendMail({
    from: SMTP_FROM || `"GeM Advisor Website" <${SMTP_USER}>`,
    to,
    subject: "GeM Advisor — SMTP test",
    html:
      "<h2>SMTP is working</h2>" +
      "<p>This test was sent by <code>scripts/mail-test.mjs</code>.</p>" +
      "<p>New enquiry alerts from the website will arrive the same way.</p>",
  });
  console.log("OK");

  console.log(`\nSent. Message id: ${info.messageId}`);
  console.log(`Check the inbox for ${to} — look in Spam too.\n`);
  console.log("If it landed in Spam, add the SPF and DKIM DNS records (see DEPLOY.md).\n");
} catch (error) {
  console.log("FAILED\n");
  console.error(`${error.code ? error.code + ": " : ""}${error.message}\n`);
  console.error(explain(error) + "\n");
  process.exit(1);
}
