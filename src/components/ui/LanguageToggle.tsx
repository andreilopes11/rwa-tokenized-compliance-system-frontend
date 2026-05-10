import type { Locale } from "@/lib/i18n";

type LanguageToggleProps = {
  ariaLabel: string;
  compact?: boolean;
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LanguageToggle({
  ariaLabel,
  compact = false,
  locale,
  onChange
}: LanguageToggleProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={compact ? "language-toggle compact" : "language-toggle"}
      role="group"
    >
      <button
        className={locale === "pt" ? "active" : ""}
        onClick={() => onChange("pt")}
        type="button"
      >
        PT
      </button>
      <button
        className={locale === "en" ? "active" : ""}
        onClick={() => onChange("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
