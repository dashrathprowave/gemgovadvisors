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
    return NextResponse.json(
      { ok: false, error: "Name, mobile number and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Please enter a valid mobile number." }, { status: 400 });
  }

  const record = {
    name,
    designation: str(body?.designation, 120),
    phone,
    email,
    company: str(body?.company, 190),
    consent: body?.consent === "yes" || body?.consent === true ? 1 : 0,
    ...clientMeta(request),
  };

  const result = await recordSubmission({
    table: "registrations",
    file: "registrations.json",
    record,
    subject: `New registration — ${record.company || name}`,
    heading: "New business registration",
    intro: `${name} registered through the website and is waiting for a call back.`,
    replyTo: email,
    rows: (r) => [
      ["Name", r.name],
      ["Designation", r.designation],
      ["Mobile", r.phone],
      ["Email", r.email],
      ["Company", r.company],
      ["Consent", r.consent ? "Given" : "Not given"],
      ["Submitted", r.submittedAt],
    ],
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "We could not record your registration. Please call us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
