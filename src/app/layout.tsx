import type { Metadata } from "next";
import { appConfig } from "@/shared/config/app";
import { AppProviders } from "@/shared/providers/AppProviders";
import "./globals.css";
import "@/shared/styles/experience.css";

export const metadata: Metadata = {
  title: appConfig.brandName,
  description: appConfig.metadataDescription
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

const localeInitScript = `(function(){try{var l=localStorage.getItem("locale");if(l==="en"||l==="es"||l==="pt"){document.documentElement.lang=l;document.cookie="locale="+l+";path=/;max-age=31536000;SameSite=Lax"}}catch(e){}})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeInitScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
