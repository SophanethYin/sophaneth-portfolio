import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Providers } from "@/components/providers";
import { base } from "@/lib/data";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-jost",
});

const description =
  "Full-stack software engineer in Phnom Penh. Solo engineer behind FlowBill, the ERP that runs sales, stock and accounting at Samai Distillery.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1688"),
  title: "Yin Sophaneth | Full-stack software engineer",
  description,
  openGraph: {
    title: "Yin Sophaneth | Full-stack software engineer",
    description,
    images: [`${base}/portrait.jpg`],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Browser extensions add attributes to <html> before React loads; ignore those mismatches here only.
    <html lang="en" className={jost.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
