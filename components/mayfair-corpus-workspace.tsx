"use client";

import { useEffect, useMemo, useState } from "react";

import { SiteShell } from "@/components/site-shell";

type FieldStatus = "verified" | "review" | "missing";

type FieldHistoryEntry = {
  comment: string;
  status: FieldStatus;
  updatedAt: string;
  value: string;
};

type Field = {
  id: string;
  history?: FieldHistoryEntry[];
  label: string;
  value: string;
  comment: string;
  note?: string;
  placeholder?: string;
  source?: string;
  updatedAt?: string;
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
        value:
          "Monday-Friday: 9:00 AM-6:00 PM\nSaturday: 10:00 AM-2:00 PM\nSunday: Closed",
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
        placeholder:
          "Example: Usher townhome - great layout, fireplace, and extra privacy.",
        status: "missing",
      },
      {
        id: "current-specials",
        label: "Current specials",
        value: "",
        comment: "",
        note: "Add active concessions, reduced deposits, or the approved fallback language if specials change constantly.",
        placeholder:
          "Example: Specials change frequently - connect with our team for today's best rate.",
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
        placeholder:
          "Example: 12-month standard, select 6-month terms when available.",
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
  verified: "border-sky-200 bg-sky-50 text-sky-700",
  review: "border-amber-200 bg-amber-50 text-amber-700",
  missing: "border-slate-200 bg-slate-100 text-slate-700",
};

function fieldKey(sectionId: string, fieldId: string) {
  return `${sectionId}:${fieldId}`;
}

function createTimestamp() {
  return new Date().toISOString();
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) {
    return "Not updated yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function getPreview(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "No approved answer added yet.";
  }

  return normalized.length > 120
    ? `${normalized.slice(0, 117)}...`
    : normalized;
}

function getRowSource(field: Field) {
  if (field.source) {
    return field.source;
  }

  if (field.status === "verified") {
    return "Approved draft";
  }

  if (field.comment.trim()) {
    return "Team comment";
  }

  if (field.note) {
    return "Needs team review";
  }

  return "Draft";
}

export function MayfairCorpusWorkspace() {
  const [sections, setSections] = useState(initialSections);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | FieldStatus>("all");
  const [copied, setCopied] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newInformation, setNewInformation] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(() =>
    fieldKey(initialSections[0].id, initialSections[0].fields[0].id),
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Section[];
      const firstField = parsed[0]?.fields[0];

      const frame = window.requestAnimationFrame(() => {
        setSections(parsed);

        if (firstField) {
          setSelectedKey(fieldKey(parsed[0].id, firstField.id));
        }
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

  const latestUpdatedAt = flatFields
    .map((field) => field.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleRows = useMemo(() => {
    return sections.flatMap((section) =>
      section.fields
        .filter((field) => {
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
        })
        .map((field) => ({
          sectionId: section.id,
          sectionTitle: section.title,
          sectionDescription: section.description,
          field,
        })),
    );
  }, [filter, normalizedQuery, sections]);

  const effectiveSelectedKey =
    visibleRows.some((row) => fieldKey(row.sectionId, row.field.id) === selectedKey)
      ? selectedKey
      : visibleRows[0]
        ? fieldKey(visibleRows[0].sectionId, visibleRows[0].field.id)
        : "";

  const selectedRow = visibleRows.find(
    (row) => fieldKey(row.sectionId, row.field.id) === effectiveSelectedKey,
  );

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
                field.id !== fieldId
                  ? field
                  : field[key] === nextValue
                    ? field
                    : {
                        ...field,
                        [key]: nextValue,
                        updatedAt: createTimestamp(),
                        history: [
                          {
                            value: field.value,
                            comment: field.comment,
                            status: field.status,
                            updatedAt: field.updatedAt ?? createTimestamp(),
                          },
                          ...(field.history ?? []),
                        ].slice(0, 8),
                      },
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
    setSelectedKey(fieldKey(initialSections[0].id, initialSections[0].fields[0].id));
  }

  function addKnowledgeRow() {
    const topic = newTopic.trim();
    const information = newInformation.trim();
    const comment = newComment.trim();

    if (!topic || !information) {
      return;
    }

    const additionsSectionId = "team-additions";
    const newField: Field = {
      id: `team-added-${Date.now()}`,
      history: [],
      label: topic,
      value: information,
      comment,
      source: "Team added",
      updatedAt: createTimestamp(),
      status: "review",
      note: "Team-added knowledge row. Verify wording and promote to verified when approved for the AI assistant.",
    };

    setSections((current) => {
      const existingSection = current.find(
        (section) => section.id === additionsSectionId,
      );

      if (existingSection) {
        return current.map((section) =>
          section.id === additionsSectionId
            ? { ...section, fields: [newField, ...section.fields] }
            : section,
        );
      }

      return [
        {
          id: additionsSectionId,
          title: "Team Additions",
          description:
            "New knowledge rows added by the leasing team while refining the corpus.",
          fields: [newField],
        },
        ...current,
      ];
    });

    setSelectedKey(fieldKey(additionsSectionId, newField.id));
    setIsEditorOpen(true);
    setNewTopic("");
    setNewInformation("");
    setNewComment("");
  }

  return (
    <SiteShell>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_21rem]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(243,248,255,0.98)_58%,rgba(229,238,251,0.95))] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700/80">
            AI knowledge workspace
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl tracking-[-0.05em] text-slate-950 md:text-6xl">
            The Mayfair AI leasing knowledge base.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            Use this page to review, update, and expand the information your AI
            leasing assistant uses for phone calls and chat. Keep answers
            accurate, add missing details, and leave team notes wherever
            something still needs confirmation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Rows in corpus" value={String(counts.total)} tone="default" />
            <SummaryCard label="Verified" value={String(counts.verified)} tone="verified" />
            <SummaryCard label="Needs review" value={String(counts.review)} tone="review" />
            <SummaryCard label="Missing" value={String(counts.missing)} tone="missing" />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.96))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Editing flow
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            <p>Pick a row from the list and refine the answer in the editor.</p>
            <p>Leave a comment when the team needs to verify policy or supply missing detail.</p>
            <p>Use the add knowledge form for net-new topics that were not in the initial draft.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Last updated
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {formatTimestamp(latestUpdatedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={copyOpenItems}
              className="rounded-full border border-sky-200 bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {copied ? "Copied open items" : "Copy review summary"}
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset local draft
            </button>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Add knowledge
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-slate-950">
            Add additional information your AI should know.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Use this for new topics, extra policy context, or team knowledge the
            original draft did not cover. New rows are easy to review and edit
            inside the same list.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[0.85fr_1.4fr]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Topic
              </span>
              <input
                value={newTopic}
                onChange={(event) => setNewTopic(event.target.value)}
                placeholder="Example: Package lockers"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Information
              </span>
              <textarea
                value={newInformation}
                onChange={(event) => setNewInformation(event.target.value)}
                placeholder="Add the answer or context the AI should use."
                rows={4}
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Team note
            </span>
            <input
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Optional context for reviewers or approval notes"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addKnowledgeRow}
              disabled={!newTopic.trim() || !newInformation.trim()}
              className="rounded-full border border-sky-200 bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              Add knowledge row
            </button>
            <p className="text-sm text-slate-500">
              New entries default to <span className="font-semibold">Needs review</span>.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(247,250,255,0.98),rgba(255,255,255,0.98))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Example topics
          </p>
          <div className="mt-5 grid gap-3">
            {[
              ["Specials", "Move-in specials, concession timing, or approved fallback language when promotions change."],
              ["Availability", "Unit availability windows, immediate move-ins, and expected upcoming openings."],
              ["Events", "Resident events, community activations, and seasonal programming the team references often."],
            ].map(([topic, info]) => (
              <div
                key={topic}
                className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4"
              >
                <p className="text-sm font-semibold text-slate-900">{topic}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <label
              htmlFor="corpus-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Search knowledge rows
            </label>
            <input
              id="corpus-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic, note, phrase, or comment"
              className="w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            {[
              { value: "all", label: "All rows" },
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
                      ? "bg-sky-600 text-white shadow-[0_10px_30px_rgba(14,116,144,0.14)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-[1.1fr_0.8fr_1.8fr_0.9fr_0.7fr] gap-4 border-b border-slate-200 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          <p>Knowledge level</p>
          <p>Domain</p>
          <p>How your AI will respond</p>
          <p>Status</p>
          <p>Source</p>
        </div>

        {visibleRows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No corpus rows matched the current search and filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {visibleRows.map((row) => {
              const active =
                fieldKey(row.sectionId, row.field.id) === effectiveSelectedKey;

              return (
                <button
                  key={fieldKey(row.sectionId, row.field.id)}
                  type="button"
                  onClick={() => {
                    setSelectedKey(fieldKey(row.sectionId, row.field.id))
                    setIsEditorOpen(true);
                  }}
                  className={`grid w-full grid-cols-[1.1fr_0.8fr_1.8fr_0.9fr_0.7fr] gap-4 px-6 py-5 text-left transition ${
                    active
                      ? "bg-[linear-gradient(90deg,rgba(240,249,255,1),rgba(247,250,252,0.94))]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      The Mayfair Apartment Homes
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.sectionTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{row.field.label}</p>
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-slate-700">
                      {getPreview(row.field.value)}
                    </p>
                    {row.field.note ? (
                      <p className="mt-2 text-xs text-sky-700/72">
                        Review note attached
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-start">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusClasses[row.field.status]}`}
                    >
                      {statusLabel[row.field.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      {getRowSource(row.field)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {row.field.updatedAt
                        ? `Updated ${formatTimestamp(row.field.updatedAt)}`
                        : row.field.comment.trim()
                          ? "Comment added"
                          : "Draft row"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedRow && isEditorOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/18 px-4 py-10 backdrop-blur-[6px]">
          <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/76">
                  {selectedRow.sectionTitle}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-slate-950">
                  {selectedRow.field.label}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid max-h-[calc(88vh-6rem)] gap-0 overflow-y-auto xl:grid-cols-[minmax(0,1.45fr)_22rem]">
              <article className="p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <p className="max-w-3xl text-sm leading-7 text-slate-600">
                    {selectedRow.sectionDescription}
                  </p>
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${statusClasses[selectedRow.field.status]}`}
                      >
                        {statusLabel[selectedRow.field.status]}
                      </span>
                      <label className="sr-only" htmlFor={`${selectedRow.field.id}-status`}>
                        Status
                      </label>
                      <select
                        id={`${selectedRow.field.id}-status`}
                        value={selectedRow.field.status}
                        onChange={(event) =>
                          updateField(
                            selectedRow.sectionId,
                            selectedRow.field.id,
                            "status",
                            event.target.value,
                          )
                        }
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                      >
                        <option value="verified">Verified</option>
                        <option value="review">Needs review</option>
                        <option value="missing">Missing info</option>
                      </select>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Last updated: {formatTimestamp(selectedRow.field.updatedAt)}
                    </p>
                  </div>
                </div>

                {selectedRow.field.note ? (
                  <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-sky-800">
                    <span className="font-semibold">Verify / update:</span>{" "}
                    {selectedRow.field.note}
                  </div>
                ) : null}

                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Approved answer
                    </span>
                    <textarea
                      value={selectedRow.field.value}
                      onChange={(event) =>
                        updateField(
                          selectedRow.sectionId,
                          selectedRow.field.id,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder={
                        selectedRow.field.placeholder ?? "Add the approved answer"
                      }
                      rows={Math.max(
                        8,
                        Math.min(18, selectedRow.field.value.split("\n").length + 5),
                      )}
                      className="min-h-[18rem] w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Team comment
                    </span>
                    <textarea
                      value={selectedRow.field.comment}
                      onChange={(event) =>
                        updateField(
                          selectedRow.sectionId,
                          selectedRow.field.id,
                          "comment",
                          event.target.value,
                        )
                      }
                      placeholder="Leave context, follow-up, approval notes, or questions here"
                      rows={12}
                      className="min-h-[18rem] w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:bg-white"
                    />
                  </label>
                </div>
              </article>

              <aside className="border-t border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,253,0.98))] p-6 xl:border-t-0 xl:border-l">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Row details
                </p>
                <div className="mt-5 space-y-4">
                  <DetailBlock label="Property" value="The Mayfair Apartment Homes" />
                  <DetailBlock label="Section" value={selectedRow.sectionTitle} />
                  <DetailBlock label="Domain" value={selectedRow.field.label} />
                  <DetailBlock label="Current source" value={getRowSource(selectedRow.field)} />
                  <DetailBlock
                    label="Last updated"
                    value={formatTimestamp(selectedRow.field.updatedAt)}
                  />
                  <DetailBlock
                    label="Comment state"
                    value={
                      selectedRow.field.comment.trim()
                        ? "Comment added"
                        : "No team comment yet"
                    }
                  />
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Previous answers
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedRow.field.history?.length ? (
                      selectedRow.field.history.map((entry, index) => (
                        <div
                          key={`${selectedRow.field.id}-history-${index}`}
                          className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                              {formatTimestamp(entry.updatedAt)}
                            </p>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusClasses[entry.status]}`}
                            >
                              {statusLabel[entry.status]}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-700">
                            {entry.value || "No prior approved answer saved."}
                          </p>
                          {entry.comment ? (
                            <p className="mt-3 text-sm leading-7 text-slate-500">
                              Comment: {entry.comment}
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-500">
                        No previous answers saved yet. Once this row is edited,
                        earlier versions will appear here.
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </SiteShell>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "verified" | "review" | "missing";
}) {
  const toneClasses: Record<typeof tone, string> = {
    default: "border-slate-200 bg-white text-slate-950",
    verified: "border-sky-200 bg-sky-50 text-sky-800",
    review: "border-amber-200 bg-amber-50 text-amber-800",
    missing: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <div
      className={`rounded-[1.4rem] border p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] ${toneClasses[tone]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl tracking-[-0.05em]">{value}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
    </div>
  );
}
