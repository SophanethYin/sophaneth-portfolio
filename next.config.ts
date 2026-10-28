import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files, so GitHub Pages can host them.
  output: "export",
  // GitHub Pages serves the site under /<repo>; the deploy workflow sets this. Empty locally.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Pages has no image server, so images are served as-is.
  images: { unoptimized: true },
};

export default nextConfig;
