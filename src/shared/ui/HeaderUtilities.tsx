"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

type HeaderUtilitiesProps = {
  themeToggleClassName?: string;
};

export function HeaderUtilities({ themeToggleClassName }: HeaderUtilitiesProps) {
  return (
    <div className="header-utilities">
      <LanguageSwitcher />
      <ThemeToggle className={themeToggleClassName} />
    </div>
  );
}
