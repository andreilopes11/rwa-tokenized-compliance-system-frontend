"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  type Locale,
  normalizeLocale
} from "./config";
import { formatMessage } from "./format";
import { getMessages } from "./getMessages";
import type { Messages } from "./types";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (path: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const fromStorage = window.localStorage.getItem(LOCALE_COOKIE);
    return normalizeLocale(fromStorage);
  } catch {
    return DEFAULT_LOCALE;
  }
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

function resolvePath(messages: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const initial = readStoredLocale();
    setLocaleState(initial);
    applyLocale(initial);
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyLocale(next);

    try {
      window.localStorage.setItem(LOCALE_COOKIE, next);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const t = useCallback(
    (path: string, values?: Record<string, string | number>) => {
      const template = resolvePath(messages, path);
      if (!template) {
        return path;
      }
      return formatMessage(template, values);
    },
    [messages]
  );

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale,
      t
    }),
    [locale, messages, setLocale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useMessages(): Messages {
  return useLocale().messages;
}
