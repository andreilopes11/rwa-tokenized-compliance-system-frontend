import { ApiError } from "@/shared/api/errors";
import { apiLocaleHeaders } from "@/shared/i18n/apiLocale";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

export async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "same-origin",
      ...init,
      headers: apiLocaleHeaders(init?.headers)
    });
  } catch {
    throw new ApiError("errors.apiUnavailable", 502, true);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const messages = Array.isArray((payload as { messages?: unknown[] } | null)?.messages)
      ? ((payload as { messages: string[] }).messages.join(" ") || response.statusText)
      : ((payload as { message?: string } | null)?.message ?? response.statusText);
    const retryable = response.status === 502 || response.status === 503;
    const message = messages || "errors.requestFailed";
    throw new ApiError(message, response.status, retryable);
  }

  return payload as T;
}

export function authorizedRequest(init: RequestInit = {}): RequestInit {
  return {
    credentials: "same-origin",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    }
  };
}

/** @deprecated Use authorizedRequest — admin auth is now session/JWT based. */
export function adminRequest(_adminToken: string, init: RequestInit = {}): RequestInit {
  return authorizedRequest(init);
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
