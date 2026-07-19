import type { NextConfig } from "next";
// Railway deployment: Use standalone for Node.js server
// This allows both static pages AND dynamic API routes

const nextConfig: NextConfig = {
  // output: "standalone" = Full Node.js server with API routes
  // Includes everything needed to run the server independently
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
