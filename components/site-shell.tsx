import Image from "next/image";
import Link from "next/link";

import { navigation } from "@/lib/navigation";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-10rem] h-[24rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.48),transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="rounded-full border border-black/10 bg-white/60 px-5 py-3 shadow-[0_18px_50px_rgba(20,24,36,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-deep)] shadow-[0_12px_32px_rgba(24,39,66,0.2)]">
                <Image
                  src="/logos/tourCollapsedIconTYG.png"
                  alt="Partners Tour icon"
                  width={28}
                  height={28}
                  priority
                />
              </div>
              <div>
                <p className="font-display text-xl tracking-[-0.04em] text-[var(--color-ink)]">
                  Partners Tour
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  LeaseMagnets client systems starter
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 py-8 md:py-10">{children}</main>

        <footer className="mt-8 border-t border-black/8 px-2 pt-6 pb-2 text-sm text-[var(--color-muted)]">
          Fresh Next.js foundation for landing pages, client work, quotes,
          invoices, and future AI subagent tooling.
        </footer>
      </div>
    </div>
  );
}
