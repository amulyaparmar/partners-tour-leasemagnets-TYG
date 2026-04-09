"use client";

import Image from "next/image";
import { useState } from "react";

const options = [
  {
    name: "Technician Onsite",
    price: "$200 / floor plan",
    description:
      "We come onsite and handle the scan for you so the process stays simple and hands-off.",
    details: [
      "Outside Michigan: 3 floor plan minimum per trip",
      "Within Michigan: no minimum",
    ],
  },
  {
    name: "Self-Capture",
    price: "$299 / property",
    description:
      "We ship a 360 camera to your team, train them, and let you capture as many floor plans as needed onsite.",
    details: [
      "Best for teams capturing multiple layouts",
      "Remote equipment walkthrough and support included",
    ],
  },
];

const aiBenefits = [
  "Guided voice-led walkthrough",
  "AI motion scenes inside the tour",
  "Extra context on features that are easy to miss on camera",
];

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M8.5 6.5h7l1.1 1.5H19a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2.4l1.1-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M12 3l1.9 4.7L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketingHero() {
  const [selectedOption, setSelectedOption] = useState<"onsite" | "self">("onsite");
  const [aiVideoEnabled, setAiVideoEnabled] = useState(false);

  const basePrice = selectedOption === "onsite" ? 200 : 299;
  const totalPrice = aiVideoEnabled ? basePrice + 100 : basePrice;
  const selectedLabel =
    selectedOption === "onsite" ? "Technician Onsite" : "Self-Capture";
  const priceUnit = selectedOption === "onsite" ? "/ floor plan" : "/ property";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#c2171f]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#060606_0%,#0b0b0c_45%,#14090b_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-[#ff4d57]" />
              Premium 3D Leasing Tours
            </div>

            <h1 className="mt-8 max-w-4xl text-balance font-[family:var(--font-heading)] text-5xl leading-none tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Give Every Floor Plan a Story Your Renters Can Step Into
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              Start with professional 3D capture from $200 per floor plan, then
              add AI video only if you want a more guided, premium leasing
              experience.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                  Starting Price
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  $200 / floor plan
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                  Capture Options
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  Onsite or self-capture
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                  AI Upgrade
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  +$100 / floor plan
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#ff4d57]/20 bg-white/[0.03] shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="relative">
                <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(7,7,7,0.03),rgba(7,7,7,0.18)_48%,rgba(7,7,7,0.84)_100%)]" />
                <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#ff4d57]" />
                  3D Capture Tech
                </div>
                <Image
                  src="/proposals/3d-capture/onsite-scan.png"
                  alt="LeaseMagnets creative performing a Matterport scan onsite."
                  width={2128}
                  height={1276}
                  quality={100}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="h-[24rem] w-full object-cover object-center"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/50">
                    Online first impression
                  </p>
                  <p className="mt-2 max-w-md text-2xl font-semibold leading-8 text-white">
                    The &quot;in-person&quot; feeling — without the in-person.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3 text-white">
                <CameraIcon />
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">
                  Why it works
                </p>
              </div>

              <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
                Give renters more confidence before the onsite visit.
              </h2>
              <p className="mt-5 text-base leading-8 text-white/68">
                A strong 3D tour helps prospects understand layout, flow, and
                finishes earlier in the leasing process. The AI add-on gives you a
                more guided version when you want the tour to do more of the
                selling.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.26em] text-white/45">
              Choose your setup
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
              Flexible 3D Capture Setup
            </h2>

            <div className="mt-8 space-y-4">
              {options.map((option) => {
                const isSelected =
                  (selectedOption === "onsite" && option.name === "Technician Onsite") ||
                  (selectedOption === "self" && option.name === "Self-Capture");

                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() =>
                      setSelectedOption(
                        option.name === "Technician Onsite" ? "onsite" : "self",
                      )
                    }
                    className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                      isSelected
                        ? "border-[#ff4d57]/40 bg-[#14090b]"
                        : "border-white/10 bg-black/25 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold text-white">
                          {option.name}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-white/68">
                          {option.description}
                        </p>
                      </div>
                      <div className="text-right text-xl font-semibold text-[#ff6a72]">
                        {option.price}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {option.details.map((detail) => (
                        <div
                          key={detail}
                          className="flex gap-3 text-sm leading-7 text-white/68"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4d57]" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`rounded-[2rem] border p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 ${
              aiVideoEnabled
                ? "border-[#ff4d57]/30 bg-[#14090b]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">
                  AI video combo
                </p>
                <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
                  Opt in only if you want a more guided tour.
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    aiVideoEnabled
                      ? "border-[#ff4d57]/35 bg-[#ff4d57]/15 text-[#ff8e94]"
                      : "border-white/10 bg-white/5 text-white/55"
                  }`}
                >
                  {aiVideoEnabled ? "Enabled" : "Optional"}
                </div>
                <SparkIcon />
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    Add AI Video Combo
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Add voice-led narration and animated scenes for priority
                    units and premium presentations.
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        aiVideoEnabled
                          ? "border-[#ff4d57]/35 bg-[#ff4d57]/15 text-[#ff8e94]"
                          : "border-white/10 bg-white/5 text-white/55"
                      }`}
                    >
                      {aiVideoEnabled ? "AI Video Enabled" : "AI Video Optional"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiVideoEnabled((value) => !value)}
                  aria-pressed={aiVideoEnabled}
                  className={`relative inline-flex h-10 w-[5.25rem] items-center overflow-hidden rounded-full border transition ${
                    aiVideoEnabled
                      ? "border-[#ff4d57]/50 bg-[#5a1f24]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <span className="sr-only">Toggle AI Video Combo</span>
                  <span
                    className={`absolute top-1/2 left-1 h-8 w-8 -translate-y-1/2 rounded-full bg-white shadow-lg transition-transform ${
                      aiVideoEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div
              className={`mt-6 rounded-[1.5rem] border p-6 ${
                aiVideoEnabled
                  ? "border-[#ff4d57]/30 bg-[#1a0d10]"
                  : "border-[#ff4d57]/20 bg-[#120b0c]"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-[0.24em] ${
                  aiVideoEnabled ? "text-[#ffb0b5]" : "text-[#ff8e94]"
                }`}
              >
                Current selection
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                ${totalPrice}
                <span className="text-lg font-medium text-white/60">
                  {" "}
                  {priceUnit}
                </span>
              </p>
              <p className="mt-3 text-lg text-white">
                {selectedLabel}
                {aiVideoEnabled ? " + AI Video Combo" : ""}
              </p>
              <p className="mt-2 text-sm text-white/60">
                {aiVideoEnabled
                  ? "AI-guided storytelling is included in this selection."
                  : "This selection keeps the tour streamlined without the AI add-on."}
              </p>

              <div className="mt-6 space-y-3">
                {(aiVideoEnabled
                  ? aiBenefits
                  : selectedOption === "self"
                    ? ["Guided set up", "Simple, easy updates (scan any time)"]
                    : [
                        "Professional 3D capture",
                        "Easy online touring",
                        "Clean, simple starting point",
                      ]
                ).map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-7 text-white/72">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4d57]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              AI Video Combo
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
              A mini tour that explains what the camera can’t.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68">
              {aiVideoEnabled
                ? "The AI Video Combo is on. Your tour now includes guided narration and animated moments that help prospects understand more before they ever visit in person."
                : "The AI Video Combo is optional. Turn it on when you want a more guided leasing experience with narration and animated moments built into the tour."}
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Use image avatar and voice cloning to keep the same leasing agent guiding each prospect through the experience.",
                "Call out details like internet options, bed size, smart-home features, and other invisible differentiators.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-black/25 p-5"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-[#ff7c83]">
                    Benefit 0{index + 1}
                  </div>
                  <p className="mt-3 text-sm leading-8 text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="h-[100%] min-h-[40rem] w-full bg-black">
              <iframe
                src="https://maximize.tour.video/?uuid=@theabbot&desktopWidth=70&authCodeLeadForm=false&isTwoColumn=true&screen=floor_plans.3d_2x2&inline=true&openTour=true"
                title="The Abbot 3D + AI Video"
                className="h-full w-full"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
