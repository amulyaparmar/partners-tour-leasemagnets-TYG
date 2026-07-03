import type { Metadata } from "next";

import { FortyEightWestLoopPlayer } from "@/components/48-west-loop-player";

export const metadata: Metadata = {
  title: "48 West Loop",
  description:
    "A public loop player for the 48 West LeaseMagnets tour videos.",
};

export default function FortyEightWestLoopPage() {
  return <FortyEightWestLoopPlayer />;
}
