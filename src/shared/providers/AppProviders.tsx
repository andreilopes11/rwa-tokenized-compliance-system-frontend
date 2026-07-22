"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { queryClient, wagmiConfig } from "@/shared/lib/web3";
import { LocaleProvider } from "@/shared/i18n/LocaleProvider";
import { SessionStatusProvider } from "@/shared/providers/SessionStatusProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <SessionStatusProvider>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </WagmiProvider>
        </SessionStatusProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
