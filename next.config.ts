import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/quotes-shared/performance-report/the-timbers",
        destination: "/quotes-shared/the-timbers-performance-report.html",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/storyboards/csl-premium-deck",
        destination: "/storyboards/csl-brand-awareness",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
