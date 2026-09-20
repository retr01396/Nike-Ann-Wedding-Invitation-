/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Serve AVIF first (smallest at equal quality), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Set minimumCacheTTL to 0 so manual image replacements in public/images/
    // are served immediately upon browser refresh without stale 31-day caching.
    minimumCacheTTL: 0,
  },
};

export default nextConfig;
