import Link from "next/link";

import { SiteShell } from "@/components/site-shell";
import { getAssetSummary } from "@/lib/asset-library";

const platformTracks = [
  {
    title: "Landing pages that convert",
    body: "A clean front door for each client or campaign, with room for custom demos, proof, and offers.",
  },
  {
    title: "Client work that stays organized",
    body: "One place to grow into intake flows, delivery boards, status snapshots, and reusable operating views.",
  },
  {
    title: "Custom tooling and AI agents",
    body: "A practical surface for internal tools, agent-powered workflows, and client-specific utility pages.",
  },
];

const roadmap = [
  {
    phase: "Now",
    title: "Ship the foundation",
    body: "Landing page, tool map, client-work direction, and a shared asset library live in one repo.",
  },
  {
    phase: "Next",
    title: "Add client operating views",
    body: "Turn the static structure into authenticated workspaces for pipeline, delivery, billing, and reporting.",
  },
  {
    phase: "Later",
    title: "Run subagents and automations",
    body: "Layer in task runners, AI assistants, and client-specific tooling without rebuilding the frontend shell.",
  },
];

export default async function Home() {
  const assetSummary = await getAssetSummary();

  return (
    <SiteShell>
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-[rgba(255,250,242,0.82)] p-8 shadow-[0_24px_80px_rgba(20,24,36,0.08)] backdrop-blur md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Partners Tour starter
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.94] tracking-[-0.05em] text-[var(--color-ink)] md:text-7xl">
            Launch the landing page now. Grow it into the client-workbench later.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
            This project is set up to start as a polished LeaseMagnets-facing
            site, then expand into custom client tooling, AI subagents,
            invoicing flows, quote management, and internal delivery systems.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              View tool roadmap
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors duration-200 hover:bg-white"
            >
              Open shared asset library
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {platformTracks.map((track) => (
              <article
                key={track.title}
                className="rounded-[1.5rem] border border-black/8 bg-white/65 p-5"
              >
                <div className="mb-4 h-2 w-14 rounded-full bg-[var(--color-accent)]" />
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  {track.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {track.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="rounded-[2rem] border border-black/10 bg-[var(--color-deep)] p-7 text-white shadow-[0_24px_80px_rgba(20,24,36,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
              Ready in this repo
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <div className="text-3xl font-display tracking-[-0.05em]">
                  {assetSummary.logos}
                </div>
                <p className="mt-2 text-sm text-white/72">brand logos copied over</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <div className="text-3xl font-display tracking-[-0.05em]">
                  {assetSummary.invoices}
                </div>
                <p className="mt-2 text-sm text-white/72">
                  shared invoice files available
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <div className="text-3xl font-display tracking-[-0.05em]">
                  {assetSummary.quotes}
                </div>
                <p className="mt-2 text-sm text-white/72">shared quote files available</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 shadow-[0_24px_80px_rgba(20,24,36,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Suggested build order
            </p>
            <div className="mt-6 space-y-5">
              {roadmap.map((item) => (
                <div
                  key={item.phase}
                  className="rounded-[1.25rem] border border-black/8 bg-[var(--color-panel)] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {item.phase}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-16 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white/72 p-7 shadow-[0_24px_80px_rgba(20,24,36,0.08)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            What this starter is for
          </p>
          <h2 className="mt-4 max-w-xl font-display text-3xl tracking-[-0.04em] text-[var(--color-ink)] md:text-4xl">
            A cleaner base for client delivery than the all-in-one source app.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
            The original project is broad. This one is intentionally smaller:
            a branded marketing surface, a route structure that is easy to grow,
            and shared public assets already in place for proposals, invoices,
            and future client work.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              label: "/tools",
              title: "Tool roadmap",
              body: "Outline the internal and client-facing utilities this app should grow into.",
            },
            {
              label: "/clients",
              title: "Client work model",
              body: "Define how intake, delivery, billing, and reporting should sit together.",
            },
            {
              label: "/library",
              title: "Shared asset index",
              body: "Browse copied logos plus direct links to the invoice and quote HTML files.",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.75rem] border border-black/10 bg-[rgba(255,255,255,0.8)] p-6 shadow-[0_24px_70px_rgba(20,24,36,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {item.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
