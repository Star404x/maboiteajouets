import type { NextConfig } from "next";
// API Routes require standalone output (not export)
// This allows both static pages AND dynamic API routes on Netlify

const nextConfig: NextConfig = {
  // Use export for static pages
  // API routes will be handled by Netlify Functions
  output: "standalone",
  images: { unoptimized: true },
  trailingSlash: false,
};

console.log('[next.config] Output mode:', nextConfig.output);

export default nextConfig;

/**
 * Architecture:
 * - output: "standalone" = Node.js server with API routes
 * - API routes at /api/prices handle GET/POST
 * - Admin panel calls /api/prices to update
 * - Netlify runs Node server and serves static pages
 */
