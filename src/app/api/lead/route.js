import { NextResponse } from "next/server";
import { recordSubmission } from "@/lib/submissions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trims, caps to the column width and stores empty values as NULL. */
function str(value, max) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, max) : null;
}

function clientMeta(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return {
    ip_address: str(forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip"), 45),
    user_agent: str(request.headers.get("user-agent"), 255),
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = str(body?.name, 120);
  const phone = str(body?.phone, 20);
  const email = str(body?.email, 190);

  if (!name || !phone || !email) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const record = {
    name,
    company: str(body?.company, 190),
    phone,
    email,
    service: str(body?.service, 120),
    message: str(body?.message, 5000),
    ...clientMeta(request),
  };

  const result = await recordSubmission({
    table: "leads",
    file: "leads.json",
    record,
    subject: `New enquiry — ${record.service || "General"} — ${name}`,
    heading: "New enquiry",
    intro: `${name} sent a message through the contact form.`,
    replyTo: email,
    rows: (r) => [
      ["Name", r.name],
      ["Company", r.company],
      ["Phone", r.phone],
      ["Email", r.email],
      ["Service Required", r.service],
      ["Message", r.message],
      ["Submitted", r.submittedAt],
    ],
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Could not record lead" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
