import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

type SiteTopBarProps = {
  actions: ReactNode;
  subtitle: string;
  title: string;
};

export function SiteTopBar({ actions, subtitle, title }: SiteTopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
