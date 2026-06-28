// All /api/* calls go to the same origin and are proxied to the Express
// backend by the Next.js rewrite in next.config.ts. No CORS, no exposed URL.

async function safeJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(res.ok ? "Invalid server response." : `Server error (${res.status}). Please try again.`);
  }
}

export async function apiPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await safeJson(res) as Record<string, string>;
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const data = await safeJson(res) as Record<string, string>;
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data as T;
}
