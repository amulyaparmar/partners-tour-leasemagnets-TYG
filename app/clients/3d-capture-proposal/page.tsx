import type { Metadata } from "next";

import { MarketingHero } from "@/components/marketing-hero";

export const metadata: Metadata = {
  title: "3D Capture Proposal",
  description:
    "Premium proposal page for LeaseMagnets 3D capture, Matterport tours, and AI mini video enhancements.",
};

export default function ThreeDCaptureProposalPage() {
  return <MarketingHero />;
}
