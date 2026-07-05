import type { Metadata } from "next";

import { HannahLoftsLoopPlayer } from "@/components/hannah-lofts-loop-player";

export const metadata: Metadata = {
  title: "Hannah Lofts Loop Player",
  description:
    "A public office-loop player for the Hannah Townhomes & Lofts LeaseMagnets tour videos.",
};

export default function HannahLoftsLoopPage() {
  return <HannahLoftsLoopPlayer />;
}
