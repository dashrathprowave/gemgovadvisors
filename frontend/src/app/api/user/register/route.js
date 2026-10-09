/**
 * Proxy for the AI chatbot's lead-capture endpoint.
 *
 * The widget's "name + 10-digit mobile" gate posts here; we
 * validate lightly and forward to the FastAPI backend
 * (AI_Chatbot - V2), which stores the lead in its own database
 * for the sales team to follow up.
 */

import { NextResponse } from "next/server";

const BACKEND = process.env.CHATBOT_API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").replace(/\D/g, "");
  if (name.length < 2 || phone.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name and a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  const payload = {
    name: name.slice(0, 200),
    phone: phone.slice(0, 20),
    session_id: String(body?.session_id ?? "anon").slice(0, 128),
    tenant_id: String(body?.tenant_id ?? "default").slice(0, 64),
  };

  let upstream;
  try {
    upstream = await fetch(`${BACKEND}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Chat service unavailable" }, { status: 502 });
  }

  let data = {};
  try {
    data = await upstream.json();
  } catch {
    /* backend returned non-JSON — pass the status through */
  }

  return NextResponse.json(data, { status: upstream.status });
}
