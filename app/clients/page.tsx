import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/site-shell";

const clientFlow = [
  {
    title: "Intake",
    body: "Capture scope, timing, client contacts, source assets, and goals so work starts with context instead of scattered notes.",
  },
  {
    title: "Delivery",
    body: "Track what is in progress, what is blocked, and what is ready for review across campaigns, pages, media, or tooling work.",
  },
  {
    title: "Billing",
    body: "Keep shared invoices and quotes close to the actual project work so operations and finance stop drifting apart.",
  },
  {
    title: "Automation",
    body: "Attach subagents and repeatable tasks where they remove real manual work instead of becoming a side system.",
  },
];

export const metadata: Metadata = {
  title: "Clients",
  description: "Client work model for the Partners Tour LeaseMagnets starter.",
};

export default function ClientsPage() {
  return (
    <SiteShell>
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-black/10 bg-[var(--color-deep)] p-8 text-white shadow-[0_24px_80px_rgba(20,24,36,0.14)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
            Client work surface
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl tracking-[-0.05em] md:text-6xl">
            The future client portal should be operational, not decorative.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
            This app can evolve into the place where LeaseMagnets manages scope,
            delivery, billing, and agent-driven execution for each client. That
            means real work views first, nice dashboards second.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/72 p-8 shadow-[0_24px_80px_rgba(20,24,36,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Design principle
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-[-0.04em] text-[var(--color-ink)]">
            Every client page should answer three questions fast.
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "What are we doing for this client right now?",
              "What has been delivered, reviewed, or billed already?",
              "What can be automated next without creating more operational drag?",
            ].map((line) => (
              <div
                key={line}
                className="rounded-[1.25rem] border border-black/8 bg-[var(--color-panel)] px-5 py-4 text-sm leading-7 text-[var(--color-muted)]"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {clientFlow.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-black/10 bg-white/78 p-6 shadow-[0_24px_70px_rgba(20,24,36,0.06)]"
          >
            <div className="h-2 w-16 rounded-full bg-[var(--color-accent)]" />
            <h2 className="mt-5 text-2xl font-semibold text-[var(--color-ink)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-black/10 bg-white/78 p-8 shadow-[0_24px_70px_rgba(20,24,36,0.06)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Live client page
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-[-0.04em] text-[var(--color-ink)]">
              The Mayfair AI corpus workspace is available as its own route.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Use the dedicated page for structured review, inline edits, and
              team comments before the leasing agent goes live.
            </p>
          </div>
          <Link
            href="/clients/mayfair-ai-corpus"
            className="rounded-full border border-[var(--color-deep)] bg-[var(--color-deep)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
          >
            Open Mayfair corpus
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
