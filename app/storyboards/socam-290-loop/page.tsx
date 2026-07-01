import type { Metadata } from "next";

import { Socam290LoopPlayer } from "@/components/socam-290-loop-player";

export const metadata: Metadata = {
  title: "SoCam 290 Loop Player",
  description:
    "A public office-loop player for the SoCam 290 LeaseMagnets tour videos.",
};

export default function Socam290LoopPage() {
  return <Socam290LoopPlayer />;
}
