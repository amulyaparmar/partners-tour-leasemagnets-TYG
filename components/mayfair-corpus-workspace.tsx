"use client";

import { useEffect, useState } from "react";

import { SiteShell } from "@/components/site-shell";

type FieldStatus = "verified" | "review" | "missing";

type Field = {
  id: string;
  label: string;
  value: string;
  comment: string;
  note?: string;
  placeholder?: string;
  status: FieldStatus;
};

type Section = {
  id: string;
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "mayfair-ai-corpus-v1";

const initialSections: Section[] = [
  {
    id: "property-info",
    title: "Property Info",
    description:
      "Core facts the AI agent needs for basic prospect questions and handoffs.",
    fields: [
      {
        id: "property-name",
        label: "Property name",
        value: "The Mayfair Apartment Homes",
        comment: "",
        status: "verified",
      },
      {
        id: "property-address",
        label: "Property address",
        value: "4254 Maple Leaf Dr, New Orleans, LA 70131",
        comment: "",
        status: "verified",
      },
      {
        id: "property-phone",
        label: "Phone number",
        value: "(504) 345-1274",
        comment: "",
        note: "Confirm this is the primary leasing line. Listing sites show slightly different numbers.",
        status: "review",
      },
      {
        id: "property-email",
        label: "Email address",
        value: "",
        comment: "",
        note: "Add the primary leasing email so the AI agent can share it confidently.",
        placeholder: "leasing@themayfairalgiers.com",
        status: "missing",
      },
      {
        id: "property-website",
        label: "Property website",
        value: "https://www.themayfairalgiers.com/",
        comment: "",
        status: "verified",
      },
      {
        id: "application-link",
        label: "Application link",
        value: "",
        comment: "",
        note: "Paste the direct application URL the AI should send to ready-to-apply prospects.",
        placeholder: "https://...",
        status: "missing",
      },
      {
        id: "virtual-tour-link",
        label: "Virtual tour link",
        value: "",
        comment: "",
        note: "Add the Tour.video or Matterport link for remote prospects.",
        placeholder: "https://...",
        status: "missing",
      },
      {
        id: "military-discount",
        label: "Military discount",
        value:
          "The Mayfair proudly serves U.S. Military members and offers a military discount.",
        comment: "",
        note: "Confirm the discount amount, documentation requirements, and any eligibility details.",
        status: "review",
      },
    ],
  },
  {
    id: "property-story",
    title: "Property Story",
    description:
      "The core positioning language the AI should use when introducing the community.",
    fields: [
      {
        id: "property-description",
        label: "Property description",
        value:
          "Set in one of the oldest and most historic neighborhoods in New Orleans, The Mayfair Apartment Homes brings Southern luxury and modern convenience together on the peaceful west bank of the Mississippi River. Whether you're a U.S. Military member, a student at the University of Holy Cross, or a family looking for more space in The Big Easy, The Mayfair has a home for you.\n\nInside, enjoy upgraded one, two, and three-bedroom townhomes and apartments featuring in-home washers and dryers, gourmet kitchens with faux granite countertops and energy-efficient stainless-steel appliances, private patios, wood-style flooring, and Wi-Fi readiness with a complimentary first month of Cox service included.\n\nOutside, escape the Louisiana heat at the resort-style swimming pool, let the kids splash in the dedicated splash area, or get moving at the 24-hour fitness center. The clubhouse is available for private events, and daily conveniences are all within easy reach.",
        comment: "",
        status: "verified",
      },
      {
        id: "hours-script",
        label: "Scripted response for office hours",
        value:
          "\"Our office is open Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 2 PM. You can reach us at (504) 345-1274 or through the website. Can I help you schedule a tour or answer any questions about availability?\"",
        comment: "",
        note: "Update if Saturday hours or the main phone number change.",
        status: "review",
      },
    ],
  },
  {
    id: "hours-tours",
    title: "Hours And Tours",
    description:
      "Hours, touring expectations, and links the AI should use when moving a prospect toward a visit.",
    fields: [
      {
        id: "business-hours",
        label: "Business hours",
        value: "Monday-Friday: 9:00 AM-6:00 PM\nSaturday: 10:00 AM-2:00 PM\nSunday: Closed",
        comment: "",
        note: "Some listing sources show Saturday as closed. Confirm the current Saturday schedule.",
        status: "review",
      },
      {
        id: "in-person-tours",
        label: "In-person tours",
        value:
          "Available during office hours. Walk-ins welcome. Valid photo ID required. Typical tour length: 15-30 minutes.",
        comment: "",
        note: "Clarify whether walk-ins are always welcome or if scheduled appointments are preferred.",
        status: "review",
      },
      {
        id: "virtual-tours",
        label: "Virtual tours",
        value:
          "Available 24/7 via the property website. Prospects can also request a live virtual tour with a leasing team member.",
        comment: "",
        note: "Add the exact virtual tour URL once confirmed.",
        status: "review",
      },
    ],
  },
  {
    id: "floor-plans",
    title: "Floor Plans And Pricing",
    description:
      "Pricing changes often, so this area is intentionally easy to review and refresh.",
    fields: [
      {
        id: "floor-plan-summary",
        label: "Floor plan summary",
        value:
          "The Mayfair offers one, two, and three-bedroom apartments and townhomes ranging from 737 to 1,872 sq ft. Pricing starts at $1,153+/month.",
        comment: "",
        note: "Verify price floor and range before deployment or each weekly refresh.",
        status: "review",
      },
      {
        id: "floor-plan-list",
        label: "Floor plans",
        value:
          "1 Bedroom\nDrake - 1 Bed / 1 Bath - 737 sq ft\nAdele - 1 Bed / 1 Bath - 771 sq ft\nKenny - 1 Bed / 1 Bath + Den - 900 sq ft\n\n2 Bedroom\nSelena - 2 Bed / 1 Bath - 950 sq ft\nBruno - 2 Bed / 2 Bath / Private Patio - 972 sq ft\nUsher - 2 Bed / 2 Bath / Fireplace (Townhome) - 1,175 sq ft\nShakira - 2 Bed / 2 Bath - 1,243 sq ft\n\n3 Bedroom\nRihanna - 3 Bed / 2 Bath - 1,102 sq ft\nBeyonce - 3 Bed / 2 Bath / Private Patio - 1,170 sq ft\nCalvin - 3 Bed / 2 Bath - 1,375 sq ft\nAriana - 3 Bed / 2 Bath - 1,698 sq ft\nTaylor - 3 Bed / 2 Bath - 1,809 sq ft\nKendrick - 3 Bed / 3 Bath - 1,872 sq ft",
        comment: "",
        note: "Update names, square footages, pricing, and live availability before launch.",
        status: "review",
      },
      {
        id: "most-popular-plan",
        label: "Most popular floor plan",
        value: "",
        comment: "",
        note: "Add the unit your team recommends most often, plus why residents love it.",
        placeholder: "Example: Usher townhome - great layout, fireplace, and extra privacy.",
        status: "missing",
      },
      {
        id: "current-specials",
        label: "Current specials",
        value: "",
        comment: "",
        note: "Add active concessions, reduced deposits, or the approved fallback language if specials change constantly.",
        placeholder: "Example: Specials change frequently - connect with our team for today's best rate.",
        status: "missing",
      },
    ],
  },
  {
    id: "amenities-pets",
    title: "Amenities And Pet Policy",
    description:
      "Lifestyle detail that helps the AI feel specific, confident, and useful.",
    fields: [
      {
        id: "community-amenities",
        label: "Community amenities",
        value:
          "Resort-style swimming pool\nKids' splash area\n24-hour fitness center\nPlayground\nClubhouse available for private events\nPet park\nValet trash pickup\nGated entry with controlled access\nNight patrol / on-site security\nOn-site management",
        comment: "",
        note: "Add any missing amenities like package lockers, grilling areas, or car wash stations.",
        status: "review",
      },
      {
        id: "in-home-features",
        label: "In-home features",
        value:
          "In-home washer and dryer\nCentral air conditioning\nEnergy-efficient stainless-steel appliances\nFaux granite countertops\nPrivate patios in select units\nFireplaces in select units\nWood-style flooring\nKeyless entry\nWi-Fi readiness with Cox equipment installed and the first month included",
        comment: "",
        status: "verified",
      },
      {
        id: "pet-policy",
        label: "Pet policy",
        value:
          "Cats and dogs welcome\nUp to 2 pets per home\nPet deposit: $450 per pet (one-time)\nBreed restrictions apply\nESA and service animals are handled per fair housing guidelines",
        comment: "",
        note: "Confirm whether the deposit is refundable, whether monthly pet rent applies, the weight limit, and the current breed list.",
        status: "review",
      },
      {
        id: "pet-script",
        label: "Scripted response for pet questions",
        value:
          "\"We love pets! We allow up to two cats or dogs per home with a $450 deposit per pet. Breed restrictions do apply, so I'd love to connect you with our leasing team to confirm your furry family member qualifies. Want me to help set that up?\"",
        comment: "",
        note: "Adjust once the official pet rent, weight limit, or breed list is confirmed.",
        status: "review",
      },
    ],
  },
  {
    id: "leasing-requirements",
    title: "Lease Terms And Screening",
    description:
      "High-value questions for calls and chat. These should be as exact as possible.",
    fields: [
      {
        id: "lease-lengths",
        label: "Standard lease lengths",
        value: "",
        comment: "",
        note: "List all offered lease terms such as 12-month, 6-month, or month-to-month.",
        placeholder: "Example: 12-month standard, select 6-month terms when available.",
        status: "missing",
      },
      {
        id: "move-in-windows",
        label: "Lease start dates and move-in windows",
        value:
          "Immediate move-ins may be available outside the standard lease cycle, but prospects should be connected with the leasing team for exact timing.",
        comment: "",
        note: "Add your normal move-in windows and any turnover patterns so the AI can set expectations accurately.",
        status: "review",
      },
      {
        id: "eligibility-criteria",
        label: "Eligibility criteria",
        value:
          "Self-qualifying\nMinimum income: [add requirement]\nCredit score minimum: [add requirement]\nBackground screening: [describe standards]\nSecurity deposit: [add amount or formula]\n\nGuarantor qualifying\nGuarantor income minimum: [add requirement]\nGuarantor credit minimum: [add requirement]\nRequired documents: Government-issued ID and proof of income\nDeposit with guarantor: [add amount]",
        comment: "",
        note: "Fill in the exact qualification thresholds before go-live.",
        status: "missing",
      },
      {
        id: "application-documents",
        label: "Required application documents",
        value:
          "Government-issued photo ID\nProof of income such as pay stubs, offer letter, bank statements, or SSA award letter\nGuarantor documentation if applicable\nPet documentation if applicable\nESA or service animal paperwork if applicable",
        comment: "",
        note: "Review this checklist against your actual application package.",
        status: "review",
      },
      {
        id: "fees-insurance-subleasing",
        label: "Application fees, insurance, and subleasing",
        value:
          "Application fee: $[AMOUNT] per applicant\nAdmin / move-in fee: $[AMOUNT]\nSecurity deposit: $[AMOUNT or formula]\nPet deposit: $450 per pet\n\nRenter's insurance required: [Yes / No]\nMinimum liability coverage: $[AMOUNT]\nIf no third-party policy: [describe auto-enrollment option]\n\nSubleasing allowed: [Yes / No]\nRelet / transfer fee: $[AMOUNT]\nProcess: New resident must apply, be approved, and sign their own lease.",
        comment: "",
        note: "These are some of the most common trust-building questions. Replace every bracketed placeholder with exact policy.",
        status: "missing",
      },
    ],
  },
  {
    id: "utilities-parking",
    title: "Utilities And Parking",
    description:
      "These details prevent the AI from sounding vague or overpromising on monthly cost.",
    fields: [
      {
        id: "included-utilities",
        label: "Included in rent",
        value:
          "Wi-Fi readiness: Cox equipment installed, first month complimentary\nValet trash: Included\nAdditional included utilities: [confirm whether any others are bundled]",
        comment: "",
        note: "Confirm exactly what is included in rent and make it explicit if nothing else is bundled.",
        status: "review",
      },
      {
        id: "resident-paid-utilities",
        label: "Resident-paid utilities",
        value:
          "Residents set up and pay: [electricity / gas / water if not included]\nBilling method: [Direct with provider / SimpleBills / RUBS / other]",
        comment: "",
        note: "If utilities are billed through a third party, describe that clearly and add a monthly estimate if possible.",
        status: "missing",
      },
      {
        id: "parking-policy",
        label: "Parking policy",
        value:
          "On-site parking: Included for residents / [cost if applicable]\nParking pass required: [Yes / No]\nAssigned or unassigned: [Specify]\nGuest parking: Available in designated visitor spots\nGuest parking passes: Temporary passes available - [describe process]\nEnforcement: Vehicles without permits or parked incorrectly may be towed",
        comment: "",
        note: "Confirm the current permit, guest pass, and towing rules.",
        status: "missing",
      },
    ],
  },
  {
    id: "community-location-maintenance",
    title: "Community, Location, And Maintenance",
    description:
      "Warm, specific neighborhood details make the AI sound grounded instead of generic.",
    fields: [
      {
        id: "resident-events",
        label: "Resident events and community life",
        value:
          "The Mayfair hosts regular resident events throughout the year to keep the community connected.\n\nExample events\nPool parties and cookouts\nHoliday and seasonal celebrations\nResident appreciation events\nCoffee and donuts with management\nGame nights and trivia nights\nFitness challenges and wellness events",
        comment: "",
        note: "Replace the sample events with your actual recurring events and note how often they happen.",
        status: "review",
      },
      {
        id: "location-overview",
        label: "Location and nearby highlights",
        value:
          "The Mayfair is set in the historic Old Aurora / Algiers neighborhood on the west bank of the Mississippi River.\n\nDining nearby\nOlive Branch Cafe\nOishii Sushi House\n\nGroceries and shopping\nAlgiers Central Market\nOld Algiers Fresh Market\n3 shopping centers within 1.6 miles\n\nEducation and healthcare\nUniversity of Holy Cross\nSt. Luke Medical Center\nTulane University approx. 7.3 miles away\n\nGetting around\nAlgiers / Canal Street Ferry - 6 miles\nInterstate 10 - under 3 miles\nFrench Quarter / Bourbon Street - less than 10 miles\nLouis Armstrong New Orleans International Airport - approx. 21 miles",
        comment: "",
        note: "Add more nearby dining, coffee, grocery, and commute detail with approximate drive times.",
        status: "review",
      },
      {
        id: "security-maintenance",
        label: "Security and maintenance",
        value:
          "Gated community with controlled access entry\nNight patrol / on-site security\nOn-site management team\nOn-site maintenance: [add days and hours]\n24-hour emergency maintenance: [Yes / No and contact method]\nOnline maintenance requests: [Yes / No and portal or app name]",
        comment: "",
        note: "Add details on courtesy officers, cameras, monitored alarms, portal names, and the emergency maintenance process.",
        status: "missing",
      },
    ],
  },
  {
    id: "agent-guidance",
    title: "AI Agent Guidance",
    description:
      "Voice, objection handling, and fallback language for phone and chat use.",
    fields: [
      {
        id: "agent-name",
        label: "Suggested AI agent name",
        value: "",
        comment: "",
        note: "Choose one or two names that fit the Mayfair's warm Southern tone.",
        placeholder: "Example: Mayla",
        status: "missing",
      },
      {
        id: "tone-guidance",
        label: "Personality and tone",
        value:
          "Warm and welcoming, never pushy\nKnowledgeable about the neighborhood and New Orleans culture\nRedirects concerns into features or positive next steps\nEnds every interaction with a clear call to action: schedule a tour, call the office, or apply",
        comment: "",
        status: "verified",
      },
      {
        id: "objection-handling",
        label: "Objection reframing guide",
        value:
          "\"Is the area safe?\" -> Emphasize the gated community, controlled access, and night patrol.\n\"Is it far from downtown?\" -> Reframe around the Canal Street Ferry and the peace of historic Algiers.\n\"I'm not sure about the neighborhood.\" -> Highlight the history, charm, and residential feel of Algiers.\n\"Do you allow large dogs?\" -> Confirm pet-friendliness while handing off breed-specific qualification to the team.\n\"What's the commute like?\" -> Mention the ferry, I-10 access, and proximity to key destinations.",
        comment: "",
        status: "verified",
      },
      {
        id: "fallbacks",
        label: "Fallback responses",
        value:
          "General fallback: \"That's a great question, and I want to make sure I give you accurate information. Our leasing team will know the answer for sure - would you like help scheduling a call or tour?\"\n\nPricing fallback: \"Pricing and availability move quickly, and I want to make sure you get the most accurate numbers for your move-in date.\"\n\nUtilities fallback: \"Utility coverage can depend on the unit and lease structure, and I want to make sure you have the right numbers.\"\n\nMaintenance fallback: \"I'm sorry to hear that - please contact our maintenance team at (504) 345-1274 or submit a request through the resident portal.\"\n\nComplaint handling: \"I'm really sorry to hear that, and I appreciate you sharing it with us. Could I get your name and best contact so our manager can reach out directly?\"",
        comment: "",
        note: "Add the resident portal name or direct maintenance link so the fallback can be more specific.",
        status: "review",
      },
    ],
  },
];

const statusLabel: Record<FieldStatus, string> = {
  verified: "Verified",
  review: "Needs review",
  missing: "Missing info",
};

const statusClasses: Record<FieldStatus, string> = {
  verified:
    "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
  review:
    "border-amber-200 bg-amber-50 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
  missing:
    "border-rose-200 bg-rose-50 text-rose-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
};

export function MayfairCorpusWorkspace() {
  const [sections, setSections] = useState(initialSections);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | FieldStatus>("all");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Section[];
      const frame = window.requestAnimationFrame(() => {
        setSections(parsed);
      });

      return () => window.cancelAnimationFrame(frame);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const flatFields = sections.flatMap((section) => section.fields);
  const counts = {
    total: flatFields.length,
    verified: flatFields.filter((field) => field.status === "verified").length,
    review: flatFields.filter((field) => field.status === "review").length,
    missing: flatFields.filter((field) => field.status === "missing").length,
  };

  const normalizedQuery = query.trim().toLowerCase();

  const visibleSections = sections
    .map((section) => {
      const visibleFields = section.fields.filter((field) => {
        const matchesFilter = filter === "all" || field.status === filter;
        const haystack = [
          section.title,
          section.description,
          field.label,
          field.value,
          field.note ?? "",
          field.comment,
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery =
          normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

        return matchesFilter && matchesQuery;
      });

      return { ...section, fields: visibleFields };
    })
    .filter((section) => section.fields.length > 0);

  function updateField(
    sectionId: string,
    fieldId: string,
    key: "value" | "comment" | "status",
    nextValue: string,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              fields: section.fields.map((field) =>
                field.id !== fieldId ? field : { ...field, [key]: nextValue },
              ),
            },
      ),
    );
  }

  async function copyOpenItems() {
    const openItems = sections.flatMap((section) =>
      section.fields
        .filter((field) => field.status !== "verified")
        .map(
          (field) =>
            `${section.title} - ${field.label}\nStatus: ${statusLabel[field.status]}\nCurrent draft: ${field.value || "[blank]"}\nTeam note: ${field.note || "No note provided."}\nComment: ${field.comment || "[no comment]"}\n`,
        ),
    );

    await navigator.clipboard.writeText(openItems.join("\n"));
    setCopied(true);
  }

  function resetDraft() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSections(initialSections);
  }

  return (
    <SiteShell>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_20rem]">
        <div className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,251,245,0.93),rgba(248,241,231,0.9))] p-8 shadow-[0_30px_90px_rgba(21,32,51,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            AI leasing setup
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl tracking-[-0.05em] text-[var(--color-ink)] md:text-6xl">
            The Mayfair AI corpus form for phone and chat.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
            This workspace turns the draft into an editable review surface.
            Your team can update copy directly, leave comments beside each
            answer, and quickly see which fields still need verification before
            the AI leasing agent goes live.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total fields" value={String(counts.total)} />
            <SummaryCard label="Verified" value={String(counts.verified)} />
            <SummaryCard label="Needs review" value={String(counts.review)} />
            <SummaryCard label="Missing info" value={String(counts.missing)} />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/8 bg-white/70 p-6 shadow-[0_24px_80px_rgba(21,32,51,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Team workflow
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>
              Edit the answer field if you want to replace the draft with the
              final approved wording.
            </p>
            <p>
              Use the comment box if you want to flag uncertainty, leave a
              follow-up, or keep context for the leasing team.
            </p>
            <p>
              Switch the status to <span className="font-semibold">Verified</span>{" "}
              once the team has confirmed the field.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={copyOpenItems}
              className="rounded-full border border-[var(--color-deep)] bg-[var(--color-deep)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-92"
            >
              {copied ? "Copied open items" : "Copy review summary"}
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-black/20 hover:bg-black/[0.03]"
            >
              Reset to original draft
            </button>
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-[2rem] border border-black/8 bg-white/72 p-5 shadow-[0_24px_70px_rgba(21,32,51,0.06)] backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="corpus-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]"
            >
              Search the corpus
            </label>
            <input
              id="corpus-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic, phrase, note, or comment"
              className="w-full rounded-[1.1rem] border border-black/10 bg-[rgba(255,255,255,0.88)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none ring-0 placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            {[
              { value: "all", label: "All fields" },
              { value: "review", label: "Needs review" },
              { value: "missing", label: "Missing info" },
              { value: "verified", label: "Verified" },
            ].map((option) => {
              const active = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFilter(option.value as "all" | FieldStatus)
                  }
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--color-deep)] text-white"
                      : "border border-black/10 bg-white text-[var(--color-muted)] hover:border-black/20 hover:text-[var(--color-ink)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {visibleSections.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-black/12 bg-white/60 p-10 text-center text-[var(--color-muted)]">
            No fields matched your current search and filter.
          </div>
        ) : null}

        {visibleSections.map((section, sectionIndex) => (
          <article
            key={section.id}
            className="rounded-[2rem] border border-black/8 bg-[rgba(255,252,247,0.84)] p-6 shadow-[0_28px_80px_rgba(21,32,51,0.06)] md:p-7"
          >
            <div className="flex flex-col gap-3 border-b border-black/8 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Section {sectionIndex + 1}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-[var(--color-ink)]">
                  {section.title}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                {section.description}
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className="rounded-[1.6rem] border border-black/8 bg-white/80 p-5 shadow-[0_18px_45px_rgba(21,32,51,0.05)]"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                        {field.label}
                      </h3>
                      {field.note ? (
                        <p className="mt-2 max-w-3xl rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
                          <span className="font-semibold">Verify / update:</span>{" "}
                          {field.note}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${statusClasses[field.status]}`}
                      >
                        {statusLabel[field.status]}
                      </span>
                      <label className="sr-only" htmlFor={`${field.id}-status`}>
                        Status
                      </label>
                      <select
                        id={`${field.id}-status`}
                        value={field.status}
                        onChange={(event) =>
                          updateField(
                            section.id,
                            field.id,
                            "status",
                            event.target.value,
                          )
                        }
                        className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="verified">Verified</option>
                        <option value="review">Needs review</option>
                        <option value="missing">Missing info</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Answer used by AI
                      </span>
                      <textarea
                        value={field.value}
                        onChange={(event) =>
                          updateField(
                            section.id,
                            field.id,
                            "value",
                            event.target.value,
                          )
                        }
                        placeholder={field.placeholder ?? "Add the approved answer"}
                        rows={Math.max(4, Math.min(14, field.value.split("\n").length + 2))}
                        className="min-h-[9rem] w-full rounded-[1.15rem] border border-black/10 bg-[rgba(250,248,244,0.95)] px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Team comment
                      </span>
                      <textarea
                        value={field.comment}
                        onChange={(event) =>
                          updateField(
                            section.id,
                            field.id,
                            "comment",
                            event.target.value,
                          )
                        }
                        placeholder="Leave context, follow-up, or approval notes here"
                        rows={6}
                        className="min-h-[9rem] w-full rounded-[1.15rem] border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,32,51,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}
