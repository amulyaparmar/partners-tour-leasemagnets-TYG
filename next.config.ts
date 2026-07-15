import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/quotes-shared/performance-report/the-timbers",
        destination: "/quotes-shared/the-timbers-performance-report.html",
      },
      {
        source: "/feature-stack/guided-leasing",
        destination: "/quotes-shared/guided-leasing-proposal.html",
      },
      {
        source: "/priderock-edge75-tour-production.html",
        destination:
          "/invoices-shared/priderock-edge75-tour-production.html",
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
