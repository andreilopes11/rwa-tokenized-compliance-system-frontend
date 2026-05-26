import type { Locale } from "./config";
import { DEFAULT_LOCALE, normalizeLocale } from "./config";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { pt } from "./messages/pt";
import type { Messages } from "./types";

const catalogs: Record<Locale, Messages> = {
  en,
  es,
  pt
};

export function getMessages(locale?: string | null): Messages {
  return catalogs[normalizeLocale(locale ?? DEFAULT_LOCALE)];
}
