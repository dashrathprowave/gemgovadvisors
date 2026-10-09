const BACKEND_URL = process.env.CHATBOT_API_URL || "http://127.0.0.1:8000";

async function proxyAdmin(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join("/") || "";
  const url = `${BACKEND_URL}/api/admin/${slug}`;

  // Copy headers
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Forward the request
  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    duplex: "half",
  });

  // Create response with proper headers
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!["content-encoding", "transfer-encoding", "connection"].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  // Handle streaming response for SSE
  if (response.headers.get("content-type")?.includes("text/event-stream")) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  const data = await response.arrayBuffer();
  return new Response(data, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request, { params }) {
  return proxyAdmin(request, { params });
}

export async function POST(request, { params }) {
  return proxyAdmin(request, { params });
}

export async function PUT(request, { params }) {
  return proxyAdmin(request, { params });
}

export async function DELETE(request, { params }) {
  return proxyAdmin(request, { params });
}

export async function PATCH(request, { params }) {
  return proxyAdmin(request, { params });
}

export async function OPTIONS(request, { params }) {
  return proxyAdmin(request, { params });
}