/**
 * Proxy for the AI chatbot's streaming chat endpoint.
 *
 * The browser posts to our own /api/chat (same origin, no CORS),
 * and this handler forwards the request to the FastAPI backend
 * (AI_Chatbot - V2, default http://127.0.0.1:8000) and pipes the
 * SSE stream (data: {...}\n\n frames) straight back. The stream is
 * passed through unbuffered so tokens appear as they are generated.
 */

const BACKEND = process.env.CHATBOT_API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  let body;
  try {
    body = await request.text();
    // Fail fast on malformed JSON instead of forwarding it
    JSON.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let upstream;
  try {
    upstream = await fetch(`${BACKEND}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    // Backend unreachable (not running, wrong host/port)
    return new Response(
      JSON.stringify({ error: "Chat service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream the upstream body through verbatim. The headers mirror
  // what the FastAPI endpoint sends so nothing gets buffered or
  // re-compressed in between.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "identity",
    },
  });
}
