"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { queryClient, wagmiConfig } from "@/shared/lib/web3";
import { LocaleProvider } from "@/shared/i18n/LocaleProvider";
import { SessionKeepAlive } from "@/shared/providers/SessionKeepAlive";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <SessionKeepAlive />
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
