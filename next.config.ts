import type { NextConfig } from "next";

const loopPlayerShortLinks = [
  ["/s290", "/socam-290-loop-player?fullscreen=true"],
  ["/socam", "/socam-290-loop-player?fullscreen=true"],
  ["/px", "/proxi-loop-player?fullscreen=true"],
  ["/proxi", "/proxi-loop-player?fullscreen=true"],
  ["/ab", "/abbot-loop-player?fullscreen=true"],
  ["/abbot", "/abbot-loop-player?fullscreen=true"],
  ["/cm", "/carmin-loop-player?fullscreen=true"],
  ["/carmin", "/carmin-loop-player?fullscreen=true"],
  ["/rn", "/ranch-loop-player?fullscreen=true"],
  ["/ranch", "/ranch-loop-player?fullscreen=true"],
  ["/hl", "/hannah-lofts-loop-player?fullscreen=true"],
  ["/hannah", "/hannah-lofts-loop-player?fullscreen=true"],
  ["/br", "/brooks-at-stillwater-loop-player?fullscreen=true"],
  ["/brooks", "/brooks-at-stillwater-loop-player?fullscreen=true"],
  ["/48w", "/48-west-loop-player?fullscreen=true"],
  ["/48west", "/48-west-loop-player?fullscreen=true"],
];

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
      ...loopPlayerShortLinks.map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
