import type { Metadata } from "next";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWA Tokenized Compliance System",
  description:
    "Portugal and EU-first portfolio MVP for RWA onboarding, KYC, lifecycle requests, and permissioned token compliance."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
