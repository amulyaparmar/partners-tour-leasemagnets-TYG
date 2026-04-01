import type { Metadata } from "next";

import { MayfairCorpusWorkspace } from "@/components/mayfair-corpus-workspace";

export const metadata: Metadata = {
  title: "Mayfair AI Corpus",
  description:
    "Interactive review and editing workspace for The Mayfair Apartment Homes AI leasing corpus.",
};

export default function MayfairAiCorpusPage() {
  return <MayfairCorpusWorkspace />;
}
