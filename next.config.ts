import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
