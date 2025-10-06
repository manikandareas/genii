import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' https://utteranc.es",
  "frame-src https://utteranc.es", // untuk iframe komentar
  "img-src 'self' data: https://github.com https://avatars.githubusercontent.com",
  "connect-src 'self'", // tambahkan origin lain kalau perlu
  "style-src 'self'", // TETAP tanpa 'unsafe-inline' di halaman kamu
  "font-src 'self' data:",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "superb-woodpecker-318.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // Security headers for production
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;
