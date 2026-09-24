import { SITE } from "@/data/site";

const BRAND = "#EE6C0F";
const INK = "#2F2B45";
const MUTED = "#6b7280";
const LINE = "#eef0f4";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Turns a phone number or email into a tappable link, anything else into text. */
function renderValue(label, value) {
  const safe = escapeHtml(value);
  const key = label.toLowerCase();

  if (key.includes("email") && String(value).includes("@")) {
    return `<a href="mailto:${safe}" style="color:${BRAND};text-decoration:none">${safe}</a>`;
  }
  if (key.includes("mobile") || key.includes("phone")) {
    const digits = String(value).replace(/[^\d+]/g, "");
    return `<a href="tel:${escapeHtml(digits)}" style="color:${BRAND};text-decoration:none">${safe}</a>`;
  }
  return safe;
}

/**
 * Builds the notification email.
 *
 * Table-based layout with inline styles on purpose — that is what survives
 * Outlook and Gmail, which strip <style> blocks and ignore flexbox. Rows with no
 * value are dropped so the team is not reading a wall of dashes.
 */
export function buildNotificationEmail({ heading, intro, rows, id, replyTo }) {
  const filled = rows.filter(([, value]) => value !== null && value !== undefined && value !== "");

  const body = filled
    .map(
      ([label, value], i) => `
        <tr>
          <td style="padding:14px 24px;${i ? `border-top:1px solid ${LINE};` : ""}width:38%;
                     font:600 13px/1.4 Arial,sans-serif;color:${MUTED};vertical-align:top">
            ${escapeHtml(label)}
          </td>
          <td style="padding:14px 24px;${i ? `border-top:1px solid ${LINE};` : ""}
                     font:400 15px/1.5 Arial,sans-serif;color:${INK};vertical-align:top">
            ${renderValue(label, value)}
          </td>
        </tr>`
    )
    .join("");

  const reference = id
    ? `<span style="display:inline-block;background:rgba(255,255,255,.18);border-radius:20px;
                    padding:4px 12px;font:600 12px Arial,sans-serif;color:#fff">
         Reference #${escapeHtml(id)}
       </span>`
    : "";

  const replyButton = replyTo
    ? `<tr><td style="padding:0 24px 28px">
         <a href="mailto:${escapeHtml(replyTo)}"
            style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;
                   font:700 14px Arial,sans-serif;padding:13px 26px;border-radius:6px">
           Reply to ${escapeHtml(replyTo)}
         </a>
       </td></tr>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:24px 12px;background:#f5f6f8">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;
                overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)">
    <tr>
      <td style="background:${BRAND};padding:26px 24px">
        <div style="font:700 19px Arial,sans-serif;color:#fff;margin-bottom:6px">
          ${escapeHtml(heading)}
        </div>
        ${reference}
      </td>
    </tr>
    ${
      intro
        ? `<tr><td style="padding:20px 24px 4px;font:400 14px/1.6 Arial,sans-serif;color:${MUTED}">
             ${escapeHtml(intro)}
           </td></tr>`
        : ""
    }
    <tr>
      <td style="padding:12px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${body}
        </table>
      </td>
    </tr>
    ${replyButton}
    <tr>
      <td style="background:#fafbfc;border-top:1px solid ${LINE};padding:18px 24px;
                 font:400 12px/1.6 Arial,sans-serif;color:${MUTED}">
        Sent automatically from <strong style="color:${INK}">${escapeHtml(SITE.url.replace(/^https?:\/\//, ""))}</strong>.
        Replying to this email goes straight to the enquirer.
      </td>
    </tr>
  </table>
</body></html>`;
}
