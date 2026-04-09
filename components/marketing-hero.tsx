type OfferCard = {
  description: string;
  eyebrow: string;
  highlight: string;
  notes: string[];
  title: string;
};

const offerCards: OfferCard[] = [
  {
    eyebrow: "Capture Option 01",
    title: "Self-Capture",
    highlight: "$299",
    description:
      "We ship a 360 camera to your team, train them remotely, and let them capture as many floor plans as they need while onsite.",
    notes: [
      "Best for teams with multiple layouts to scan in one visit",
      "Fastest path to recurring inventory updates",
      "Remote walkthrough and support included",
    ],
  },
  {
    eyebrow: "Capture Option 02",
    title: "Technician Onsite",
    highlight: "$200 / floor plan",
    description:
      "Our team handles the scanning onsite for a polished, hands-off production flow that keeps your staff focused on leasing.",
    notes: [
      "Outside Michigan: 3 floor plan minimum per trip",
      "Within Michigan: no trip minimum",
      "Ideal for one-off captures or high-precision launches",
    ],
  },
  {
    eyebrow: "Add-On Upgrade",
    title: "AI Mini Video Combo",
    highlight: "+$100 / floor plan",
    description:
      "Layer AI-generated motion scenes and cloned voice narration into the tour so every prospect gets a guided, high-touch walkthrough.",
    notes: [
      "Consistent leasing-agent voice across every tour",
      "Highlights details not obvious on camera",
      "Built for stronger storytelling and conversion lift",
    ],
  },
];

const outcomes = [
  "Animate key moments inside the space to make the tour feel produced, not static.",
  "Use voice cloning to keep the same leasing agent guiding each prospect through the experience.",
  "Call out details like internet options, bed size, smart-home features, and other invisible differentiators.",
];

const process = [
  {
    step: "01",
    title: "Capture",
    description:
      "Choose self-capture or book our technician team for a white-glove onsite scan.",
  },
  {
    step: "02",
    title: "Enhance",
    description:
      "We build the Matterport experience, then optionally layer in AI scenes and voice-led narration.",
  },
  {
    step: "03",
    title: "Deploy",
    description:
      "Your team gets a polished, branded leasing asset ready to share across marketing and leasing channels.",
  },
];

function IconFrame({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
        tone === "accent"
          ? "border-[#ff4d57]/40 bg-[#ff4d57]/12 text-[#ff6f77]"
          : "border-white/10 bg-white/5 text-white"
      }`}
    >
      {children}
    </div>
  );
}

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
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M12 4a3 3 0 0 1 3 3v4a3 3 0 1 1-6 0V7a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M18 10.5a6 6 0 0 1-12 0M12 16.5V20M9.5 20h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarketingHero() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#c2171f]/20 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-[#5d0b10]/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%),linear-gradient(135deg,#060606_0%,#0c0c0d_42%,#14090b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-10 p-6 sm:p-8 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:p-12">
            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[#ff4d57]" />
                  LeaseMagnets Proposal
                </div>

                <h1 className="mt-8 max-w-4xl text-balance font-[family:var(--font-heading)] text-5xl leading-none tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Premium 3D capture that makes every leasing tour feel
                  high-touch and unmistakably modern.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
                  A sleek Matterport-style experience with flexible capture
                  options, onsite support when needed, and AI-enhanced tour
                  storytelling that extends your leasing team’s voice at scale.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                    Capture Flexibility
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    Self-serve or white-glove
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                    Starting Cost
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    From $299
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                    Premium Add-On
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    AI video + voice
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#ff4d57]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                    Recommended Package View
                  </p>
                  <h2 className="mt-3 font-[family:var(--font-heading)] text-3xl tracking-[-0.03em] text-white">
                    Built for leasing conversion
                  </h2>
                </div>
                <div className="rounded-full border border-[#ff4d57]/25 bg-[#ff4d57]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff7c83]">
                  Matterport-aligned
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <IconFrame tone="accent">
                    <CameraIcon />
                  </IconFrame>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Photoreal 3D walkthroughs
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-white/65">
                      Create premium floor plan tours that feel polished,
                      immersive, and ready for high-intent prospects.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <IconFrame>
                    <SparkIcon />
                  </IconFrame>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      AI scene enhancement
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-white/65">
                      Add cinematic motion moments that elevate static spaces
                      into richer, more memorable leasing assets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <IconFrame>
                    <VoiceIcon />
                  </IconFrame>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Voice-cloned leasing guidance
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-white/65">
                      Keep one consistent leasing voice across every unit tour,
                      even when the agent is not onsite.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Best-fit structure
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Onsite capture + AI Mini Video
                    </p>
                  </div>
                  <p className="text-right text-sm leading-6 text-white/55">
                    Strongest option for properties that want
                    <br />
                    premium presentation and narrative consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {offerCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4d57]/80 to-transparent" />
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                {card.eyebrow}
              </p>
              <h2 className="mt-5 font-[family:var(--font-heading)] text-3xl tracking-[-0.03em] text-white">
                {card.title}
              </h2>
              <div className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#ff5d66]">
                {card.highlight}
              </div>
              <p className="mt-4 text-base leading-8 text-white/68">
                {card.description}
              </p>
              <div className="mt-8 space-y-3 border-t border-white/8 pt-6">
                {card.notes.map((note) => (
                  <div key={note} className="flex gap-3 text-sm leading-7 text-white/72">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4d57]" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Why the AI layer matters
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
              A tour that explains what the camera can’t.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68">
              The AI Mini Video Combo turns a standard 3D walkthrough into a
              branded leasing presentation. Instead of relying on viewers to
              infer the story, we proactively guide them through it.
            </p>

            <div className="mt-8 space-y-4">
              {outcomes.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-black/25 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-[#ff7c83]">
                    Benefit 0{index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">
                  Embedded Example
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  The Abbot 3D + AI Video
                </h2>
              </div>
              <a
                href="https://maximize.tour.video/?uuid=@theabbot&desktopWidth=70&authCodeLeadForm=false&isTwoColumn=true&screen=floor_plans.3d_2x2"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#ff4d57]/35 hover:text-white"
              >
                Open full experience
              </a>
            </div>

            <div className="aspect-[16/10] w-full bg-black">
              <iframe
                src="https://maximize.tour.video/?uuid=@theabbot&desktopWidth=70&authCodeLeadForm=false&isTwoColumn=true&screen=floor_plans.3d_2x2"
                title="The Abbot 3D + AI Video"
                className="h-full w-full"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,77,87,0.11),rgba(255,255,255,0.04))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Delivery framework
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
              Clean process, premium output.
            </h2>
            <div className="mt-8 space-y-4">
              {process.map((item) => (
                <div
                  key={item.step}
                  className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-[#ff7c83]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-white/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Executive summary
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-4xl tracking-[-0.04em] text-white">
              Flexible capture with a distinctly premium finish.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68">
              This structure gives you a simple starting point for Matterport
              tour production, then adds a premium storytelling layer when you
              want the tour to carry more of the leasing conversation on its
              own.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/25 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Best for scale
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Self-Capture at $299
                </div>
                <p className="mt-2 text-sm leading-7 text-white/68">
                  Efficient for teams scanning many layouts during a single
                  onsite window.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/25 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Best for polish
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Technician + AI upgrade
                </div>
                <p className="mt-2 text-sm leading-7 text-white/68">
                  Highest-end presentation for launch assets, featured layouts,
                  and standout communities.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[#ff4d57]/20 bg-[#120b0c] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#ff8e94]">
                    Proposal takeaway
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Start simple, then upgrade the tours that need extra sales
                    power.
                  </p>
                </div>
                <div className="rounded-full border border-[#ff4d57]/25 bg-[#ff4d57]/12 px-4 py-2 text-sm font-semibold text-[#ff8e94]">
                  Matterport pricing, elevated presentation
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
