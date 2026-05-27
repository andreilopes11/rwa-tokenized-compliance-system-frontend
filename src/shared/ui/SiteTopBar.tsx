"use client";

import type { ReactNode } from "react";
import { HeaderUtilities } from "./HeaderUtilities";

type SiteTopBarProps = {
  actions: ReactNode;
  subtitle: string;
  title: string;
};

export function SiteTopBar({ actions, subtitle, title }: SiteTopBarProps) {
  return (
    <header className="topbar workspace-topbar">
      <div className="brand">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        {actions}
        <HeaderUtilities />
      </div>
    </header>
  );
}
