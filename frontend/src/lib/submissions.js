import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { insertRow } from "./db";
import { sendNotification } from "./mailer";
import { buildNotificationEmail } from "./email-template";

const DATA_DIR = path.join(process.cwd(), "data");

async function saveLocally(file, record) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(path.join(DATA_DIR, file), JSON.stringify(record) + "\n", "utf8");
}

function sendEmail({ subject, heading, intro, rows, replyTo, id }) {
  return sendNotification({
    subject,
    replyTo,
    html: buildNotificationEmail({ heading, intro, rows, id, replyTo }),
  });
}

/**
 * Stores a form submission and notifies the team.
 *
 * Three layers, deliberately: the MySQL insert is the record of truth, the
 * newline-delimited file under data/ catches anything the database refuses so a
 * lead is never silently lost, and the email is the alert. The caller is told it
 * failed only when every layer failed.
 */
export async function recordSubmission({ table, file, record, subject, heading, intro, rows, replyTo }) {
  const submittedAt = new Date();

  let saved = { ok: false, reason: "not_attempted" };
  try {
    saved = await insertRow(table, record);
  } catch (error) {
    saved = { ok: false, reason: error.message };
    console.error(`DB insert into ${table} failed:`, error);
  }

  // Keep a file copy whenever the database did not take the row.
  let savedToFile = false;
  if (!saved.ok) {
    try {
      await saveLocally(file, { ...record, submittedAt: submittedAt.toISOString() });
      savedToFile = true;
    } catch (error) {
      console.error(`Failed to write ${file}:`, error);
    }
  }

  let email = { sent: false, reason: "not_attempted" };
  try {
    email = await sendEmail({
      subject,
      heading,
      intro,
      rows: rows({ ...record, submittedAt: submittedAt.toLocaleString("en-IN") }),
      replyTo,
      id: saved.id,
    });
  } catch (error) {
    email = { sent: false, reason: error.message };
  }

  if (!saved.ok && !email.sent) {
    console.log(`Submission not stored in DB (${saved.reason}) and not emailed (${email.reason}):`, record);
  }

  return {
    ok: saved.ok || savedToFile || email.sent,
    id: saved.id ?? null,
    stored: saved.ok,
    emailed: email.sent,
  };
}
