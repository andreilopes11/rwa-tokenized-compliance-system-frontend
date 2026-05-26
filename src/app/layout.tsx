import type { Metadata } from "next";
import { appConfig } from "@/shared/config/app";
import { AppProviders } from "@/shared/providers/AppProviders";
import "@/shared/styles/experience.css";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.brandName,
  description: appConfig.metadataDescription
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
