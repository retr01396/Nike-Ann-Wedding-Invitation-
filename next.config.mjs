/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Serve AVIF first (smallest at equal quality), WebP fallback.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days — background art is immutable
  },
};

export default nextConfig;
