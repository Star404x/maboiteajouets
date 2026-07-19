import type { NextConfig } from "next";
// Railway deployment: Use standalone for Node.js server
// This allows both static pages AND dynamic API routes

const nextConfig: NextConfig = {
  // output: "standalone" = Node.js server with API routes
  // Supports both static pages AND dynamic API routes
  // API routes can use Node.js modules (pg, etc)
  output: "standalone",
  images: { unoptimized: true },
  trailingSlash: false,
};

console.log('[next.config] Output mode:', nextConfig.output);

export default nextConfig;

/**
 * Architecture:
 * - output: "standalone" = Node.js server with API routes
 * - API routes at /api/* are served by Railway Node.js container
 * - API code must NOT have module-level side effects (console.log triggers build errors)
 * - All initialization must be lazy (on first request)
 */
