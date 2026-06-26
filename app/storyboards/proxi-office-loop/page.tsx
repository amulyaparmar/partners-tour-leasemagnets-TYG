import type { Metadata } from "next";

import { ProxiOfficeLoopPlayer } from "@/components/proxi-office-loop-player";

export const metadata: Metadata = {
  title: "Proxi Office Loop",
  description:
    "A public office-loop player for the Proxi Lawrence Lease Magnets tour videos.",
};

export default function ProxiOfficeLoopPage() {
  return <ProxiOfficeLoopPlayer />;
}
