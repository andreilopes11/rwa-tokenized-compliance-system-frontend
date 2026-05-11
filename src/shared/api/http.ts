const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

export async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "same-origin",
    ...init
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const messages = Array.isArray((payload as { messages?: unknown[] } | null)?.messages)
      ? ((payload as { messages: string[] }).messages.join(" ") || response.statusText)
      : ((payload as { message?: string } | null)?.message ?? response.statusText);
    throw new Error(messages || "Request failed.");
  }

  return payload as T;
}

export function adminRequest(adminToken: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken,
      ...init.headers
    }
  };
}

export function queryString(filters: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
