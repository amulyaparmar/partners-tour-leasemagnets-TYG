import Image from "next/image";
import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-10rem] h-[24rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.48),transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="rounded-full border border-slate-200 bg-white/88 px-5 py-3 shadow-[0_18px_50px_rgba(20,24,36,0.08)] backdrop-blur">
          <div className="flex items-center">
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
                <p className="font-display text-xl tracking-[-0.04em] text-slate-900">
                  Partners Tour
                </p>
                <p className="text-sm font-medium text-slate-500">
                  LeaseMagnets client systems starter
                </p>
              </div>
            </Link>
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
