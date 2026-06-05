import Image from "next/image";
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

const guideNav = [
  {
    href: "#record-first-tour",
    title: "Record your first tour",
    body: "Capture the walkthrough, the leasing story, and the next-step CTA.",
  },
  {
    href: "#build-tour",
    title: "Build your first tour",
    body: "Use tour.new for pro or semi-pro assembly without waiting on a full production team.",
  },
  {
    href: "#pricing-report",
    title: "Use tour.report",
    body: "Understand pricing, competition, traffic, and where the market is moving.",
  },
  {
    href: "#video-ads",
    title: "Run video ads",
    body: "Launch YouTube, retargeting, and TikTok creative from the same tour assets.",
  },
  {
    href: "#serverless-ads",
    title: "Track serverless ads",
    body: "Measure traffic and campaign movement without heavy onsite instrumentation.",
  },
  {
    href: "#voice-ai",
    title: "Build a voice AI agent",
    body: "Turn tour interest into answered questions, booked tours, and faster follow-up.",
  },
];

const whyThisWorks = [
  {
    title: "The old way creates cold traffic",
    body: "A renter sees an ad, lands on a generic website, clicks through static photos, and still has to ask basic questions. That is why so much leasing traffic leaks before it becomes a tour.",
  },
  {
    title: "The tour creates warm intent",
    body: "A guided tour answers questions before the prospect talks to the team. When they click, text, call, or schedule after watching, they already understand the property and have a reason to move.",
  },
  {
    title: "The same asset powers the system",
    body: "One strong tour becomes the LeaseMagnet, the ad creative, the voice-agent knowledge base, the retargeting hook, and the proof you use to get approval for the next property.",
  },
];

const filmingPaths = [
  {
    title: "Go Pro",
    eyebrow: "Production path",
    src: "/guide/pro-tour-preview-tyg.webm",
    body: "Use this when the property needs polished footage, stronger lighting, talent direction, and launch-ready creative for a high-stakes tour.",
    bestFor: "Best for lease-ups, hero tours, portfolio proof, and paid media.",
    result:
      "You get a cleaner renter-facing walkthrough with stronger framing, pacing, and scene coverage.",
    tone: "dark",
  },
  {
    title: "Go Self Tour",
    eyebrow: "Self-setup path",
    src: "/guide/self-setup-tour-pro-preview-tyg.webm",
    body: "Use this when the team has property access and needs speed. Capture useful clips with a phone, a simple shot list, and steady scene coverage.",
    bestFor:
      "Best for fast starts, smaller properties, refreshes, and teams testing the workflow.",
    result:
      "Send the footage into tour.new so it can become a guided tour, LeaseMagnet, and ad source asset.",
    tone: "light",
  },
];

const playbookSteps = [
  {
    id: "record-first-tour",
    step: "Step 1",
    title: "Record your first tour",
    body: "Start with a simple walkthrough that answers the renter's real questions: where am I, what does the space feel like, what makes it worth touring, and what should I do next?",
    bullets: [
      "Capture arrival, exterior, lobby, amenities, model unit, bedrooms, bathrooms, storage, and closing CTA.",
      "Keep each scene steady for a few seconds so it can be edited, captioned, and repurposed.",
      "Record a natural voiceover or talking-head intro explaining who the property is for.",
    ],
    scriptTitle: "Recording script",
    script:
      "Start here: \"Hi, I am at [Property Name]. If you are looking for [student housing / downtown living / more space], I am going to show you the fastest way to understand the property before you visit in person.\"",
    expectedResult:
      "You should leave with one complete walkthrough and enough short clips to create ads, reels, and a LeaseMagnet.",
    tool: "tour.video",
  },
  {
    id: "build-tour",
    step: "Step 2",
    title: "Build the tour in tour.new",
    body: "Use tour.new to turn the footage into a guided leasing experience. It can be fully produced or semi-pro depending on how much media you already have.",
    bullets: [
      "Upload the best clips and organize them by scene: intro, amenities, floor plans, location, and closing.",
      "Add clear renter-facing labels so prospects can jump to what they care about.",
      "Publish a shareable tour link and make it the source asset for the rest of the system.",
    ],
    scriptTitle: "Tour outline",
    script:
      "Intro -> Location -> Amenities -> Model unit -> Floor plan differences -> What to do next. Keep every section useful enough that a renter can make a decision without calling first.",
    expectedResult:
      "You now have one canonical tour link that can be sent by humans, agents, ads, QR codes, and follow-up flows.",
    tool: "tour.new",
  },
  {
    id: "pricing-report",
    step: "Step 3",
    title: "Use tour.report for pricing and market context",
    body: "Before spending on ads, understand where the property sits against competitors and what traffic signals matter.",
    bullets: [
      "Compare nearby properties, pricing pressure, and positioning.",
      "Identify which amenities, floor plans, and value props should be featured first.",
      "Use the report to decide what to test in creative, not just what to say on the website.",
    ],
    scriptTitle: "Market read prompt",
    script:
      "Look at [Property Name] against the nearest competitors. Tell me which unit types, amenities, and location angles should lead the tour and which ad hooks are most likely to create qualified intent.",
    expectedResult:
      "You know what to emphasize before you spend money promoting the tour.",
    tool: "tour.report",
  },
  {
    id: "video-ads",
    step: "Step 4",
    title: "Launch video ads from the tour",
    body: "Turn the tour into short-form creative for YouTube, retargeting, and TikTok. The goal is not a perfect brand film; it is a useful video that makes the next click obvious.",
    bullets: [
      "Cut the tour into 6-15 second hooks for amenities, floor plans, location, and urgency.",
      "Retarget visitors who watched or clicked but did not schedule.",
      "Use leasemagnets.ai to create new variants and track which angles lower CPV.",
    ],
    scriptTitle: "Ad prompt",
    script:
      "Create five short video ad concepts from this tour. Each concept needs one hook, one scene recommendation, one caption, and one CTA. Prioritize qualified tour intent over generic reach.",
    expectedResult:
      "You have a small creative test ready for YouTube, TikTok, and retargeting instead of one expensive ad bet.",
    tool: "leasemagnets.ai",
  },
  {
    id: "serverless-ads",
    step: "Step 5",
    title: "Track serverless advertising",
    body: "Use lightweight campaign tracking to see whether the market is responding, without turning the property website into a complicated engineering project.",
    bullets: [
      "Track traffic, source, engagement, and campaign movement from the LeaseMagnet layer.",
      "Watch which creative sends qualified clicks instead of just cheap views.",
      "Use the findings to update tour sections, ads, and follow-up scripts.",
    ],
    scriptTitle: "Weekly report question",
    script:
      "Which traffic source created the most qualified tour engagement this week, which creative produced the cheapest useful view, and what should we change in the next test?",
    expectedResult:
      "Your team can decide what to keep, stop, or record next without waiting on a complicated analytics project.",
    tool: "leasemagnets.report",
  },
  {
    id: "voice-ai",
    step: "Step 6",
    title: "Build your first voice AI leasing agent",
    body: "Once the tour exists, the agent has something useful to reference. It can answer common questions, send links, qualify intent, and route people to schedule.",
    bullets: [
      "Load the property facts: pricing boundaries, availability rules, amenities, pet policy, parking, and tour links.",
      "Give the agent approved media links so it can send the right tour or LeaseMagnet.",
      "Keep it focused on the next leasing action: answer, send, schedule, or hand off.",
    ],
    scriptTitle: "Voice agent instruction",
    script:
      "You are the leasing assistant for [Property Name]. Answer only from approved property facts. If the prospect asks to see the property, send the tour link. If they sound ready, help them schedule. If pricing or availability is uncertain, say you do not want to guess and offer the best next step.",
    expectedResult:
      "The agent stops being a generic bot and becomes a guided leasing assistant connected to the tour system.",
    tool: "voice AI agent",
  },
];

const scriptTemplates = [
  {
    title: "First follow-up after someone watches",
    body: "Hey [Name], saw you checked out the [floor plan / amenity] tour. Want me to send the fastest link to compare availability or schedule a walkthrough?",
  },
  {
    title: "Retargeting caption",
    body: "Still comparing apartments near [Location]? Watch the full walkthrough for [Property Name] before you book an in-person tour.",
  },
  {
    title: "Leasing team handoff",
    body: "This prospect watched [Tour Section], clicked [CTA], and asked about [Question]. Start with that context instead of a generic intro.",
  },
];

const launchPlan = [
  {
    day: "Today",
    title: "Choose one property and one floor plan",
    body: "Pick the asset with the most leasing pressure or the clearest story. Do not start with the whole portfolio.",
  },
  {
    day: "Day 1",
    title: "Record and assemble the first guided tour",
    body: "Capture the walkthrough, build the tour, add the CTA, and publish the first shareable link.",
  },
  {
    day: "Day 2",
    title: "Create the first LeaseMagnet",
    body: "Use the tour, CTA, proof, and renter questions to create the first conversion surface.",
  },
  {
    day: "Day 3",
    title: "Launch retargeting and short-form tests",
    body: "Run a small set of ad variants from the tour. Track attention, CPV, and which message creates the strongest next step.",
  },
  {
    day: "Day 4+",
    title: "Add the voice agent and proof loop",
    body: "Use the tour and report data to train better follow-up, collect proof, and decide what to record next.",
  },
];

const platformLinks = [
  {
    label: "leasemagnets.new",
    body: "Create your first LeaseMagnet from the tour, media, and agent workflow.",
    href: "https://leasemagnets.new",
  },
  {
    label: "leasemagnets.university",
    body: "Learn the playbooks and review examples alongside tour.new.",
    href: "https://leasemagnets.university",
  },
  {
    label: "leasemagnet.actor",
    body: "Pick the actor or AI presenter that fits the property story.",
    href: "https://leasemagnet.actor",
  },
  {
    label: "leasemagnets.report",
    body: "Track competition, traffic, and serverless ad movement.",
    href: "https://leasemagnets.report",
  },
  {
    label: "leasemagnets.ai",
    body: "Create ads, generate new media, and monitor performance down to low CPV.",
    href: "https://leasemagnets.ai",
  },
];

const journeyImages = [
  {
    src: "/journey/journey-01.jpg",
    alt: "Amulya holding a red LeaseMagnets box outside a student housing property.",
    width: 2000,
    height: 924,
    title: "The box on the road",
    body: "A physical reminder of the early tours, property visits, and dorm-room operating energy.",
    className: "md:col-span-2",
  },
  {
    src: "/journey/journey-02.jpg",
    alt: "A group photo from a LeaseMagnets industry event.",
    width: 4032,
    height: 3024,
    title: "Industry rooms",
    body: "Showing up where leasing leaders, operators, and creators compare what is working.",
    className: "",
  },
  {
    src: "/journey/journey-03.jpg",
    alt: "Amulya taking a selfie with a LeaseMagnets box near a residential tower.",
    width: 4032,
    height: 3024,
    title: "Campus to market",
    body: "Turning the first field moments into a repeatable system for properties.",
    className: "",
  },
  {
    src: "/journey/journey-04.jpg",
    alt: "A journey photo from the early LeaseMagnets company archive.",
    width: 4608,
    height: 3456,
    title: "Early archive",
    body: "The practical, on-the-ground work behind the product story.",
    className: "",
  },
  {
    src: "/journey/journey-05.jpeg",
    alt: "A journey photo from the LeaseMagnets team archive.",
    width: 4032,
    height: 3024,
    title: "Team proof",
    body: "Moments from building the company while staying close to operators and renters.",
    className: "",
  },
  {
    src: "/journey/journey-06.jpg",
    alt: "A journey photo from the early LeaseMagnets property visit archive.",
    width: 4608,
    height: 3456,
    title: "Property visits",
    body: "The work started by learning the leasing journey in the real world.",
    className: "",
  },
];

const testimonialVideos = [
  {
    title: "The Essential",
    summary: "Wish I had done this sooner",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/essentials_t.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/essentials_testimonials.png",
    quote:
      "I would hire them at any of my projects. When I look at all the work that was done, I am thrilled.",
  },
  {
    title: "PeakMade Real Estate",
    summary: "$5M+ reported return on investment",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/peak_made.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/peakmade_testimonials.png",
    quote:
      "Our return on investment was over $5 million. It has been a phenomenal tool for the onsite teams to use.",
  },
  {
    title: "Quad Real Estate",
    summary: "Proactive, professional lease-up support",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/Quad_real_estate.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/Quad_realestate_v2.png",
    quote:
      "The team has been proactive in creating a professional video product that will make the difference in converting leads.",
  },
  {
    title: "Campus Life & Style",
    summary: "Virtual tours, real leasing confidence",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/CLS.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/cls_v2.png",
    quote:
      "The feedback from the properties where virtual tours have gone live has been amazing.",
  },
  {
    title: "Caliber Living",
    summary: "Low-lift resident coordination",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/caliber_living.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/calibar_living_v2.png",
    quote:
      "The ease with which it has been to work with them has been phenomenal.",
  },
  {
    title: "GMH Communities",
    summary: "Guided tours for remote students",
    src: "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/GMH.mp4",
    poster:
      "https://storage.googleapis.com/leasemagnets---dummy-db.appspot.com//testmonials/GMH_v2.png",
    quote:
      "LeaseMagnets helps provide that experience even when students are thousands of miles away.",
  },
];

const wallOfLove = [
  {
    src: "/testimonials/tandem-03.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1008,
    height: 337,
    title: "Wall of love 01",
    quote: "A captured win from the LeaseMagnets proof archive.",
  },
  {
    src: "/testimonials/tandem-04.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 504,
    height: 254,
    title: "Wall of love 02",
    quote: "A compact snapshot from the customer proof library.",
  },
  {
    src: "/testimonials/tandem-05.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 541,
    height: 693,
    title: "Wall of love 03",
    quote: "A vertical proof card from the Tandem attachment archive.",
  },
  {
    src: "/testimonials/tandem-07.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1130,
    height: 525,
    title: "Wall of love 04",
    quote: "A wider proof screenshot for the wall.",
  },
  {
    src: "/testimonials/tandem-08.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 824,
    height: 358,
    title: "Wall of love 05",
    quote: "A saved customer signal from the wall of love set.",
  },
  {
    src: "/testimonials/tandem-09.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1406,
    height: 396,
    title: "Wall of love 06",
    quote: "A horizontal proof capture from Dia's stored attachment links.",
  },
  {
    src: "/testimonials/tandem-10.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 2142,
    height: 768,
    title: "Wall of love 07",
    quote: "A large proof capture for the testimonial wall.",
  },
  {
    src: "/testimonials/tandem-11.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1748,
    height: 1166,
    title: "Wall of love 08",
    quote: "A fuller proof screenshot from the downloaded GCS attachments.",
  },
  {
    src: "/testimonials/tandem-12.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1694,
    height: 666,
    title: "Wall of love 09",
    quote: "A saved proof moment from the customer archive.",
  },
  {
    src: "/testimonials/tandem-13.png",
    alt: "A saved LeaseMagnets testimonial screenshot.",
    width: 1462,
    height: 554,
    title: "Wall of love 10",
    quote: "The final downloaded Tandem attachment in this wall.",
  },
];

export function MarketingHero() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#F8F9FA]">
      <MarketingHeader />

      <div className="grid grid-cols-1 grid-rows-[1fr_1px_auto] justify-center bg-[#F8F9FA] [--gutter-width:24px] sm:grid-cols-[var(--gutter-width)_minmax(0,1280px)_var(--gutter-width)] lg:[--gutter-width:40px]">
        <div className="col-start-1 row-span-full row-start-1 hidden border-x border-gray-200 bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.gray.200)] sm:block" />

        <div className="col-start-1 text-gray-900 sm:col-start-2">
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
                      Tour.video + LeaseMagnets
                    </p>
                    <h1 className="mt-4 w-full text-balance text-4xl tracking-tight text-gray-900 sm:text-6xl md:w-[72%]">
                      The video leasing playbook for your first tour,
                      LeaseMagnet, ads, and AI agent.
                    </h1>

                    <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-700">
                      Hi, I am Amulya, cofounder of tour.video and
                      leasemagnets.com. We started in the dorm with one mission:
                      make leasing easier to access, easier to understand, and
                      easier to act on. This guide shows the exact system: record
                      the tour, turn it into a LeaseMagnet, launch video ads,
                      track performance, and add an AI leasing agent.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-lg border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur"
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
                      href="#guide-playbook"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                    >
                      Start the guide
                    </Link>
                    <Link
                      href="#tool-stack"
                      className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white visited:text-white hover:bg-gray-800 hover:text-white"
                      style={{ color: "#ffffff" }}
                    >
                      Open the tool stack
                    </Link>
                    <Link
                      href="#wall-of-love"
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                    >
                      See wall of love
                    </Link>
                    <Link
                      href="#testimonial-videos"
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                    >
                      Watch testimonial videos
                    </Link>
                  </div>
                </div>
              </div>
            </header>

            <main className="relative z-20 mt-14 space-y-16 pb-20">
              <section
                id="guide-playbook"
                className="scroll-mt-24 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]"
              >
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                    Here is the playbook
                  </p>
                  <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                    How to build the first useful leasing system before you
                    scale the whole portfolio.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-gray-700">
                    The goal is simple: make one property easier to understand,
                    easier to tour, easier to advertise, and easier to follow up
                    with. Follow the steps below like an operating checklist.
                    Once one property works, the pattern repeats.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {guideNav.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-gray-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-gray-700">
                        {item.body}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section
                id="filming-paths"
                className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                      Choose your filming path
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                      Film it pro or film it yourself. Both can become a tour.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-gray-700">
                      The decision is not polished versus scrappy. The decision
                      is which path gets a useful renter-facing walkthrough
                      online fastest, with enough scenes to power the tour, the
                      LeaseMagnet, and the ads.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {filmingPaths.map((path) => (
                      <article
                        key={path.title}
                        className={`overflow-hidden rounded-lg border shadow-sm ${
                          path.tone === "dark"
                            ? "border-gray-950 bg-gray-950 text-white"
                            : "border-gray-300 bg-gray-50 text-gray-950"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between border-b px-4 py-3 ${
                            path.tone === "dark"
                              ? "border-white/10 bg-gray-950"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <p
                            className={`font-mono text-xs uppercase tracking-[0.2em] ${
                              path.tone === "dark"
                                ? "text-white/55"
                                : "text-gray-500"
                            }`}
                          >
                            {path.eyebrow}
                          </p>
                          <p
                            className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                              path.tone === "dark"
                                ? "bg-white text-gray-950"
                                : "bg-gray-950 text-white"
                            }`}
                          >
                            {path.title}
                          </p>
                        </div>

                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="aspect-[16/9] w-full bg-gray-950 object-cover"
                          src={path.src}
                        />

                        <div className="space-y-4 p-4 sm:p-5">
                          <p
                            className={`text-sm leading-7 ${
                              path.tone === "dark"
                                ? "text-white/75"
                                : "text-gray-700"
                            }`}
                          >
                            {path.body}
                          </p>
                          <div className="grid gap-3">
                            {[path.bestFor, path.result].map((item) => (
                              <div
                                key={item}
                                className={`rounded-lg border p-3 text-sm leading-6 ${
                                  path.tone === "dark"
                                    ? "border-white/10 bg-white/10 text-white/80"
                                    : "border-gray-200 bg-white text-gray-700"
                                }`}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="max-w-3xl">
                  <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                    Why this system works
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                    Static leasing pages create cold traffic. Guided tours
                    create warmer intent.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-gray-700">
                    The difference is context. A renter who has watched the
                    right tour, seen the right proof, and received the right
                    follow-up is not starting from zero.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {whyThisWorks.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-semibold text-gray-950">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                {playbookSteps.map((item) => (
                  <article
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
                      <div>
                        <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-400">
                          {item.step}
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">
                          {item.title}
                        </h2>
                        <p className="mt-5 inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                          {item.tool}
                        </p>
                      </div>

                      <div>
                        <p className="text-base leading-8 text-gray-700">
                          {item.body}
                        </p>
                        <div className="mt-6 grid gap-3">
                          {item.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700"
                            >
                              {bullet}
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-950 p-5 text-white">
                          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                            {item.scriptTitle}
                          </p>
                          <p className="mt-4 whitespace-pre-line font-mono text-sm leading-7 text-white/82">
                            {item.script}
                          </p>
                        </div>
                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Expected result
                          </p>
                          <p className="mt-3 text-sm leading-7 text-gray-700">
                            {item.expectedResult}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <section className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                    Copy-and-use scripts
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">
                    Most teams lose momentum after the tour. Use short,
                    context-rich follow-up instead.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-gray-700">
                    This is the leasing version of the Notion page&apos;s DM
                    templates: no long pitch, no generic sales language, just
                    the next helpful action.
                  </p>
                </div>

                <div className="grid gap-4">
                  {scriptTemplates.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-950">
                        {item.title}
                      </h3>
                      <p className="mt-4 rounded-lg bg-gray-50 p-4 font-mono text-sm leading-7 text-gray-700">
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-gray-950 p-6 text-white shadow-sm sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.22em] text-white/50">
                      Next 48 hours
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                      Do the smallest version that creates real leasing proof.
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {launchPlan.map((item) => (
                      <article
                        key={item.title}
                        className="rounded-lg border border-white/12 bg-white/8 p-5"
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                          {item.day}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/70">
                          {item.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section
                id="tool-stack"
                className="scroll-mt-24 relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-gray-200 before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-gray-200 after:-left-[100vw]"
              >
                <div className="grid gap-6 pt-10 lg:grid-cols-[0.36fr_0.64fr]">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                      Tool stack
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">
                      The links your team needs while following the guide.
                    </h2>
                  </div>
                  <p className="text-base leading-8 text-gray-700">
                    Each product maps to a practical part of the workflow:
                    building the tour, learning from examples, choosing an
                    actor, reporting on market movement, and creating ads or AI
                    media.
                  </p>
                </div>
                <div className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-5">
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300"
                    >
                      <h3 className="text-lg font-semibold text-gray-950">
                        {item.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {item.body}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                    Journey images
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                    The company story should feel as real as the product.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-gray-700">
                    These moments connect the dorm-room start, the first
                    property visits, and the industry rooms where the leasing
                    playbook kept getting sharper.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {journeyImages.map((item) => (
                    <figure
                      key={item.src}
                      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${item.className}`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className="aspect-[16/10] h-auto w-full object-cover"
                      />
                      <figcaption className="border-t border-gray-200 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-gray-700">
                          {item.body}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section
                id="testimonial-videos"
                className="scroll-mt-24 space-y-8"
              >
                <div className="grid gap-8 lg:grid-cols-[0.66fr_1.34fr]">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                      Testimonial videos
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                      Let partners hear the operator stories directly.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-gray-700">
                      These clips bring the proof closer to the workflow:
                      launch tours, help onsite teams, reduce friction for
                      remote renters, and turn video into a leasing asset.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {testimonialVideos.map((video) => (
                      <article
                        key={video.title}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          poster={video.poster}
                          className="aspect-video w-full bg-gray-950 object-cover"
                        >
                          <source src={video.src} type="video/mp4" />
                        </video>
                        <div className="border-t border-gray-200 p-5">
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                            {video.summary}
                          </p>
                          <h3 className="mt-3 text-xl font-semibold text-gray-950">
                            {video.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-gray-700">
                            {video.quote}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section
                id="wall-of-love"
                className="scroll-mt-24 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]"
              >
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.22em] text-gray-500">
                    Wall of love
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                    Keep the screenshots, wins, and customer proof visible.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-gray-700">
                    The wall gives every new partner a fast read on what has
                    already worked: video applications, leasing systems, ad
                    proof, tour traction, and the early experiments that shaped
                    the product.
                  </p>
                </div>

                <div className="columns-1 gap-4 sm:columns-2">
                  {wallOfLove.map((item) => (
                    <figure
                      key={item.src}
                      className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className="h-auto w-full"
                      />
                      <figcaption className="border-t border-gray-200 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-gray-700">
                          {item.quote}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-gray-950 p-6 text-white shadow-sm sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.22em] text-white/55">
                      Testimonial section
                    </p>
                    <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                      Proof belongs beside the workflow, not buried in a folder.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                      The testimonial area keeps partner stories close to the
                      lessons: record the tour, create the LeaseMagnet, launch
                      ads, track the traffic, and let agents help the renter
                      take the next step.
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/12 bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                      Featured proof
                    </p>
                    <p className="mt-4 text-2xl font-semibold leading-snug">
                      {wallOfLove[0].title}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-white/68">
                      {wallOfLove[0].quote}
                    </p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
