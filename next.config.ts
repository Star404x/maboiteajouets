import type { NextConfig } from "next";
// Railway deployment: Use standalone for Node.js server
// This allows both static pages AND dynamic API routes

const nextConfig: NextConfig = {
  // output: "export" = Static HTML export (safer for Railway)
  // Server-side API routes not supported with export
  // Use client-side fetching or serverless functions instead
  output: "export",
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
