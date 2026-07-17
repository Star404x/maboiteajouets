import type { NextConfig } from "next";
// API Routes require standalone output (not export)
// This allows both static pages AND dynamic API routes on Netlify

const nextConfig: NextConfig = {
  // Use export for static pages
  // API routes will be handled by Netlify Functions
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

/**
 * Architecture:
 * - output: "export" = static HTML (built pages)
 * - Netlify Functions handle API routes (use env vars correctly)
 * - Admin panel calls Functions to update prices
 * - Static pages generated at build time from products.ts
 */
