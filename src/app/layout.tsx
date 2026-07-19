import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { appConfig } from "@/shared/config/app";
import { AppProviders } from "@/shared/providers/AppProviders";
import "./globals.css";
import "@/shared/styles/experience.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-vg-body",
  display: "swap"
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-vg-display",
  display: "swap"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-vg-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: appConfig.brandName,
  description: appConfig.metadataDescription
};

/** Ops default: institutional dark (TECHNICAL §7). Light only when explicitly chosen. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();`;

const localeInitScript = `(function(){try{var l=localStorage.getItem("locale");if(l==="en"||l==="es"||l==="pt"){document.documentElement.lang=l;document.cookie="locale="+l+";path=/;max-age=31536000;SameSite=Lax"}}catch(e){}})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${sourceSerif.variable} ${plexMono.variable}`}
    >
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
