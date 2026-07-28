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
  
  // CRITICAL FIX: Proper cache control headers for ISR
  // Railway CDN was caching on s-maxage=31536000 (1 year)
  // Now: ISR revalidates every 10 seconds
  headers: async () => [
    {
      // Apply to product pages (ISR with short revalidate)
      source: "/produit/:slug",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=10, stale-while-revalidate=60",
        },
      ],
    },
    {
      // Apply to category pages
      source: "/categorie/:slug",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=10, stale-while-revalidate=60",
        },
      ],
    },
    {
      // Apply to homepage (ISR)
      source: "/",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=60, stale-while-revalidate=300",
        },
      ],
    },
    {
      // API routes: no cache
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
  ],
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
