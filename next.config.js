/** @type {import('next').NextConfig} */
const nextConfig = {
  // Не используем static export из-за API routes
  // Netlify будет использовать on-demand ISR вместо этого
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
