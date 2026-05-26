import { normalizeLocale, type Locale } from "./config";

export function getClientApiLocale(): Locale {
  if (typeof document === "undefined") {
    return "en";
  }

  const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
  if (match?.[1]) {
    return normalizeLocale(match[1]);
  }

  return normalizeLocale(document.documentElement.lang);
}

export function apiLocaleHeaders(extra: HeadersInit = {}): HeadersInit {
  return {
    ...extra,
    "Accept-Language": getClientApiLocale()
  };
}
