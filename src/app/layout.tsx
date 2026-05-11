import type { Metadata } from "next";
import { appConfig } from "@/shared/config/app";
import { AppProviders } from "@/shared/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.brandName,
  description: appConfig.metadataDescription
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
