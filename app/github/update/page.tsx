import { GitHubUpdateConsole } from "@/components/github-update-console";
import { MarketingHeader } from "@/components/marketing-header";

export default function GitHubUpdatePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-6 text-[var(--color-foreground)] sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <MarketingHeader />
        <GitHubUpdateConsole />
      </div>
    </main>
  );
}
