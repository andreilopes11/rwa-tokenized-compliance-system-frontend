import { ApiError } from "@/shared/api/errors";
import { publicRuntime } from "@/shared/config/publicRuntime";
import { apiLocaleHeaders } from "@/shared/i18n/apiLocale";
import { hardLogout, refreshSessionOnce } from "@/features/auth/lib/session-client";

const API_BASE_URL = publicRuntime.apiBaseUrl;
const RETRYABLE_STATUSES = new Set([502, 503]);
const RETRY_DELAYS_MS = [250, 600];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseErrorPayload(response: Response): Promise<string> {
  const payload = await response.json().catch(() => null);
  const messages = Array.isArray((payload as { messages?: unknown[] } | null)?.messages)
    ? ((payload as { messages: string[] }).messages.join(" ") || response.statusText)
    : ((payload as { message?: string } | null)?.message ?? response.statusText);
  if (response.status === 502 || response.status === 503) {
    return "errors.upstreamUnavailable";
  }
  if (response.status === 401) {
    return messages || "errors.sessionExpired";
  }
  return messages || "errors.requestFailed";
}

/**
 * Authenticated BFF client: retries gateway errors, and on 401 performs a
 * single-flight refresh + one retry before hard logout.
 */
export async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const requestInit: RequestInit = {
    credentials: "same-origin",
    ...init,
    headers: apiLocaleHeaders(init?.headers)
  };

  let response: Response | null = null;
  let attempts = 0;

  while (attempts <= RETRY_DELAYS_MS.length) {
    try {
      response = await fetch(`${API_BASE_URL}${path}`, requestInit);
    } catch {
      if (attempts >= RETRY_DELAYS_MS.length) {
        throw new ApiError("errors.upstreamUnavailable", 502, true);
      }
      await sleep(RETRY_DELAYS_MS[attempts] ?? 0);
      attempts += 1;
      continue;
    }

    if (!RETRYABLE_STATUSES.has(response.status) || attempts >= RETRY_DELAYS_MS.length) {
      break;
    }
    await sleep(RETRY_DELAYS_MS[attempts] ?? 0);
    attempts += 1;
  }

  if (!response) {
    throw new ApiError("errors.upstreamUnavailable", 502, true);
  }

  if (response.status === 401) {
    const refreshed = await refreshSessionOnce();
    if (refreshed) {
      const retry = await fetch(`${API_BASE_URL}${path}`, requestInit);
      if (retry.ok) {
        return (await retry.json().catch(() => null)) as T;
      }
      if (retry.status !== 401) {
        const message = await parseErrorPayload(retry);
        throw new ApiError(message, retry.status, retry.status === 502 || retry.status === 503);
      }
    }

    await hardLogout({ reason: "session_expired" });
    throw new ApiError("errors.sessionExpired", 401, false);
  }

  if (!response.ok) {
    const message = await parseErrorPayload(response);
    const retryable = response.status === 502 || response.status === 503;
    throw new ApiError(message, response.status, retryable);
  }

  return (await response.json().catch(() => null)) as T;
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
