import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "./config";
import { getMessages } from "./getMessages";
import type { Messages } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getServerMessages(): Promise<{ locale: Locale; messages: Messages }> {
  const locale = await getServerLocale();
  return { locale, messages: getMessages(locale) };
}
