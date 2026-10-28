import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-jost",
});

const description =
  "Full-stack software engineer in Phnom Penh. Solo engineer behind Samai Flow, the ERP that runs sales, stock and accounting at Samai Distillery.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Yin Sophaneth — Full-stack Software Engineer",
  description,
  openGraph: {
    title: "Yin Sophaneth — Full-stack Software Engineer",
    description,
    images: ["/portrait.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
