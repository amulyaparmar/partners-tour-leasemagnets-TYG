import type { Metadata } from "next";

import { CarminLoopPlayer } from "@/components/carmin-loop-player";

export const metadata: Metadata = {
  title: "The Carmin Loop Player",
  description:
    "A public office-loop player for The Carmin LeaseMagnets tour videos.",
};

export default function CarminLoopPage() {
  return <CarminLoopPlayer />;
}
