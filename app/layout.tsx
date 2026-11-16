import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { GridGlow } from "@/components/grid-glow";
import { Intro } from "@/components/intro";
import { Motion } from "@/components/motion";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono" });

const description =
  "Full-stack software engineer in Phnom Penh. Solo engineer behind FlowBill, the ERP that runs sales, stock and accounting at Samai Distillery.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1688"),
  title: "Yin Sophaneth | Full-stack software engineer",
  description,
  openGraph: {
    title: "Yin Sophaneth | Full-stack software engineer",
    description,
    type: "website",
  },
};

// Applies the saved theme before first paint, so a Cyanotype visitor never sees a Paper flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;
// Skips the intro before first paint for reduced-motion visitors; everyone else sees it on every load.
const introScript = `try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script and browser extensions change <html> before React loads; ignore those mismatches here only.
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + introScript }} />
      </head>
      <body>
        <GridGlow />
        {children}
        <Intro />
        <Motion />
      </body>
    </html>
  );
}
