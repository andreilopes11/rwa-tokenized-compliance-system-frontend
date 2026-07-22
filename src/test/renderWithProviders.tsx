import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { LocaleProvider } from "@/shared/i18n/LocaleProvider";
import { SessionStatusProvider } from "@/shared/providers/SessionStatusProvider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <SessionStatusProvider>{children}</SessionStatusProvider>
    </LocaleProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: Providers, ...options });
}
