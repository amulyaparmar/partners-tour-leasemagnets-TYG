import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";
import { getAssetLibrary } from "@/lib/asset-library";

export const metadata: Metadata = {
  title: "Library",
  description: "Shared logos, invoices, and quotes copied from the source app.",
};

export default async function LibraryPage() {
  const libraries = await getAssetLibrary();

  return (
    <SiteShell>
      <section className="rounded-[2rem] border border-black/10 bg-[rgba(255,250,242,0.82)] p-8 shadow-[0_24px_80px_rgba(20,24,36,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Shared public assets
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl tracking-[-0.05em] text-[var(--color-ink)] md:text-6xl">
          Browse the copied logos, invoices, and quotes from one place.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
          These files live in the local `public` directory, so they are already
          available for direct linking, future admin tooling, and replacement
          with real data-driven flows later.
        </p>
      </section>

      <section className="mt-12 space-y-6">
        {libraries.map((library) => (
          <div
            key={library.title}
            className="rounded-[1.9rem] border border-black/10 bg-white/78 p-7 shadow-[0_24px_70px_rgba(20,24,36,0.06)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {library.directory}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">
                  {library.title}
                </h2>
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                {library.items.length} assets
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {library.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.3rem] border border-black/8 bg-[var(--color-panel)] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {item.extension}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {item.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
