"use client";

const USER_KEY = "rag_admin_user";
const PASS_KEY = "rag_admin_pass";
const API_BASE = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "";

// Session-scoped storage: credentials die with the browser tab session
const store = typeof window !== "undefined" ? sessionStorage : null;

export function getUsername(): string {
  if (!store) return "";
  return store.getItem(USER_KEY) || "";
}

export function hasCredentials(): boolean {
  if (!store) return false;
  return getUsername() !== "" && (store.getItem(PASS_KEY) ?? "") !== "";
}

export function setCredentials(username: string, password: string) {
  if (!store) return;
  store.setItem(USER_KEY, username);
  store.setItem(PASS_KEY, password);
}

export function clearCredentials() {
  if (!store) return;
  store.removeItem(USER_KEY);
  store.removeItem(PASS_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PASS_KEY);
  localStorage.removeItem("rag_admin_token");
}

function authHeader(): string {
  if (!store) return "";
  const u = store.getItem(USER_KEY) || "";
  const p = store.getItem(PASS_KEY) || "";
  return "Basic " + btoa(`${u}:${p}`);
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": authHeader(),
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401) {
    clearCredentials();
    throw new Error("Invalid username or password");
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export const AdminAPI = {
  // Auth verification
  verify: () => api<any>("/api/admin/health"),

  // Metrics
  overview: (hours = 24) => api<any>(`/api/admin/metrics/overview?hours=${hours}`),
  timeseries: (hours = 24, bucket = "hour") => api<any>(`/api/admin/metrics/timeseries?hours=${hours}&bucket=${bucket}`),
  latency: (hours = 24) => api<any>(`/api/admin/metrics/latency?hours=${hours}`),
  topQuestions: () => api<any>(`/api/admin/metrics/top-questions?limit=20`),
  unanswered: () => api<any>(`/api/admin/metrics/unanswered?limit=50`),

  // Documents
  documents: () => api<any[]>("/api/admin/documents"),
  chunkingStrategies: () => api<any>("/api/admin/chunking/strategies"),
  uploadDocuments: async (files: File[], chunkStrategy = "auto", chunkParams: Record<string, string | number> = {}) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("tenant_id", "default");
    fd.append("chunk_strategy", chunkStrategy);
    fd.append("chunk_params", JSON.stringify(chunkParams));
    const res = await fetch(`${API_BASE}/api/admin/documents/upload`, {
      method: "POST",
      headers: { Authorization: authHeader() },
      body: fd,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  },
  createTextDocument: async (title: string, text: string, chunkStrategy = "auto", chunkParams: Record<string, string | number> = {}) => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("text", text);
    fd.append("tenant_id", "default");
    fd.append("chunk_strategy", chunkStrategy);
    fd.append("chunk_params", JSON.stringify(chunkParams));
    const res = await fetch(`${API_BASE}/api/admin/documents/create-text`, {
      method: "POST",
      headers: { Authorization: authHeader() },
      body: fd,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  },
  deleteDocument: (id: string) => api<any>(`/api/admin/documents/${id}`, { method: "DELETE" }),
  docChunks: (id: string) => api<any[]>(`/api/admin/documents/${id}/chunks`),
  reembed: (id: string) => api<any>(`/api/admin/documents/${id}/reembed`, { method: "POST" }),

  // Chunks
  updateChunk: async (chunkId: string, text: string) => {
    const fd = new FormData();
    fd.append("text", text);
    const res = await fetch(`${API_BASE}/api/admin/chunks/${chunkId}`, {
      method: "PUT",
      headers: { Authorization: authHeader() },
      body: fd,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  },
  deleteChunk: (chunkId: string) => api<any>(`/api/admin/chunks/${chunkId}`, { method: "DELETE" }),

  // Conversations
  conversations: () => api<any[]>("/api/admin/conversations"),
  conversation: (id: string) => api<any>(`/api/admin/conversations/${id}`),
  feedbackRecent: () => api<any[]>("/api/admin/feedback/recent"),

  // Cost & health
  cost: (days = 30) => api<any>(`/api/admin/cost?days=${days}`),
  health: () => api<any>("/api/admin/health"),
  storage: () => api<any>("/api/admin/storage"),
  users: () => api<any[]>(`/api/admin/users?tenant_id=default&limit=500`),

  // System prompt
  getPrompt: () => api<any>("/api/admin/prompt"),
  updatePrompt: async (prompt: string) => {
    const fd = new FormData();
    fd.append("prompt", prompt);
    const res = await fetch(`${API_BASE}/api/admin/prompt`, {
      method: "PUT",
      headers: { Authorization: authHeader() },
      body: fd,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  },
  resetPrompt: () => api<any>("/api/admin/prompt/reset", { method: "POST" }),

  // Evaluation
  goldenList: () => api<any[]>("/api/admin/eval/golden"),
  goldenAdd: (data: any) => api<any>("/api/admin/eval/golden", { method: "POST", body: JSON.stringify(data) }),
  goldenDelete: (id: string) => api<any>(`/api/admin/eval/golden/${id}`, { method: "DELETE" }),
  evalRuns: () => api<any[]>("/api/admin/eval/runs"),
  evalRun: (id: string) => api<any>(`/api/admin/eval/runs/${id}`),
  evalStart: (data: any) => api<any>("/api/admin/eval/run", { method: "POST", body: JSON.stringify(data) }),
};

export { clearCredentials, hasCredentials, setCredentials, getUsername };