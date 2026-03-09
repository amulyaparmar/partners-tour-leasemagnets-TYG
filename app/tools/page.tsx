import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

const toolGroups = [
  {
    eyebrow: "Phase 1",
    title: "Landing page builder",
    body: "Reusable hero, proof, CTA, and offer blocks so new client-facing pages can be assembled quickly instead of redesigned from scratch.",
  },
  {
    eyebrow: "Phase 2",
    title: "Client workbench",
    body: "A thin operations layer for client notes, task state, delivery status, and campaign snapshots in one place.",
  },
  {
    eyebrow: "Phase 3",
    title: "Billing and proposals",
    body: "Quote generation, invoice views, shared links, and handoff flows that connect sales work to actual delivery.",
  },
  {
    eyebrow: "Phase 4",
    title: "AI subagents",
    body: "Client-specific helpers for drafting outreach, generating assets, managing tasks, and summarizing ongoing work.",
  },
];

export const metadata: Metadata = {
  title: "Tools",
  description: "Tooling roadmap for the Partners Tour LeaseMagnets starter.",
};

export default function ToolsPage() {
  return (
    <SiteShell>
      <section className="rounded-[2rem] border border-black/10 bg-[rgba(255,250,242,0.8)] p-8 shadow-[0_24px_80px_rgba(20,24,36,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Tool roadmap
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl tracking-[-0.05em] text-[var(--color-ink)] md:text-6xl">
          Build the platform in layers, not all at once.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
          This route is the planning surface for what should get added next.
          The goal is not a giant monolith. It is a set of tight tools that can
          serve LeaseMagnets internally and later power custom client workflows.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {toolGroups.map((group, index) => (
          <article
            key={group.title}
            className="rounded-[1.75rem] border border-black/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(20,24,36,0.08)]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {group.eyebrow}
              </p>
              <span className="text-sm text-[var(--color-muted)]">
                0{index + 1}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
              {group.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {group.body}
            </p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
