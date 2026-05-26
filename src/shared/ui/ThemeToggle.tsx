"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className = "theme-toggle", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
      {showLabel ? <span>{isDark ? "Light" : "Dark"}</span> : null}
    </button>
  );
}
