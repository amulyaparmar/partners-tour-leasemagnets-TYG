import type { Metadata } from "next";

import { BrooksAtStillwaterLoopPlayer } from "@/components/brooks-at-stillwater-loop-player";

export const metadata: Metadata = {
  title: "Brooks at Stillwater Loop Player",
  description:
    "A public office-loop player for the Brooks at Stillwater LeaseMagnets tour videos.",
};

export default function BrooksAtStillwaterLoopPage() {
  return <BrooksAtStillwaterLoopPlayer />;
}
