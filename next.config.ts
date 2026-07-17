import type { NextConfig } from "next";
// API Routes require standalone output (not export)
// This allows both static pages AND dynamic API routes on Netlify

const nextConfig: NextConfig = {
  // Use standalone for API routes + static pages
  // Netlify will serve static files from CDN and route API calls to Node.js
  output: "standalone",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

/**
 * Migration note:
 * Changed from output: "export" to output: "standalone"
 * - "export" = static HTML only (no API routes)
 * - "standalone" = self-contained Node.js server (API routes supported)
 * 
 * Netlify automatically detects and uses the Node.js runtime.
 * Static pages are still optimized and cached globally.
 */
