import Link from "next/link";

import { MarketingHeader } from "@/components/marketing-header";

const metrics = [
  {
    stat: "1.5M+",
    label: "tours generated",
  },
  {
    stat: "$120M+",
    label: "in leasing influenced",
  },
  {
    stat: "24/7",
    label: "partner support",
  },
];

export function MarketingHero() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#F8F9FA]">
      <MarketingHeader />

      <div className="grid grid-cols-1 grid-rows-[1fr_1px_auto] justify-center bg-[#F8F9FA] [--gutter-width:24px] sm:grid-cols-[var(--gutter-width)_minmax(0,1280px)_var(--gutter-width)] lg:[--gutter-width:40px]">
        <div className="col-start-1 row-span-full row-start-1 hidden border-x border-gray-200 bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.gray.200)] sm:block" />

        <div className="text-gray-900">
          <div className="relative px-4 py-8 sm:px-0">
            <header>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-10 mx-auto aspect-video w-full opacity-30 md:w-3/4"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute size-full object-cover"
                >
                  <source
                    src="https://customer-qqdk2u3dbwgfurzm.cloudflarestream.com/35ba04efb498fa254d1a87d0c00c8019/downloads/default.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 size-full bg-gradient-to-r from-[#F8F9FA] via-transparent to-[#F8F9FA]" />
                <div className="absolute inset-0 size-full bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/30 to-transparent" />
              </div>

              <div className="relative z-20 mt-20 flex flex-col gap-4 sm:mt-24">
                <div className="relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-gray-200 before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-gray-200 after:-left-[100vw]">
                  <div className="px-0 py-2 sm:px-2">
                    <p className="font-mono text-sm uppercase tracking-[0.24em] text-gray-500">
                      Welcome, partners
                    </p>
                    <h1 className="mt-4 w-full text-balance text-4xl tracking-tight text-gray-900 sm:text-6xl md:w-[62%]">
                      This is the hub where we help you craft a virtual leasing
                      advantage.
                    </h1>

                    <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-700">
                      We help our partners generate over 1.5 million tours,
                      drive more than $120 million in leasing, and stay covered
                      with round-the-clock support.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur"
                    >
                      <div className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                        {metric.stat}
                      </div>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-gray-500">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-gray-200 before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-gray-200 after:-left-[100vw]">
                  <div className="flex flex-wrap gap-4 px-0 py-3 sm:px-2">
                    <Link
                      href="/clients"
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                    >
                      Explore the partner hub
                    </Link>
                    <Link
                      href="/tools"
                      className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white visited:text-white hover:bg-gray-800 hover:text-white"
                      style={{ color: "#ffffff" }}
                    >
                      See the tooling roadmap
                    </Link>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}
