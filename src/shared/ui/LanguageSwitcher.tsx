"use client";

import { Languages } from "lucide-react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/shared/i18n/config";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "language-switcher" }: LanguageSwitcherProps) {
  const { locale, setLocale, messages } = useLocale();

  return (
    <label className={className}>
      <Languages aria-hidden size={16} />
      <span className="sr-only">{messages.nav.language}</span>
      <select
        aria-label={messages.nav.language}
        onChange={(event) => setLocale(event.target.value as Locale)}
        value={locale}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
