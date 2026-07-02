import type { Metadata } from "next";

import { RanchLoopPlayer } from "@/components/ranch-loop-player";

export const metadata: Metadata = {
  title: "The Ranch at San Marcos Loop Player",
  description:
    "A public office-loop player for The Ranch at San Marcos LeaseMagnets tour videos.",
};

export default function RanchLoopPage() {
  return <RanchLoopPlayer />;
}
