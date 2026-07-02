import type { Metadata } from "next";

import { AbbotLoopPlayer } from "@/components/abbot-loop-player";

export const metadata: Metadata = {
  title: "The Abbot Loop Player",
  description:
    "A public office-loop player for The Abbot LeaseMagnets tour videos.",
};

export default function AbbotLoopPage() {
  return <AbbotLoopPlayer />;
}
