import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/storyboards/socam-290-loop/videos/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
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
