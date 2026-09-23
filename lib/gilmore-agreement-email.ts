import "server-only";

import {
  sendTransactionalEmail,
  type TransactionalEmailResult,
} from "@/lib/transactional-email";

export type GilmoreAgreementSubmission = {
  company: string;
  plan: "tour-vla" | "growth" | "growth-actors";
  name: string;
  title: string;
  email: string;
  phone: string;
  signature: string;
  date: string;
  consent: true;
};

type CompletedAgreementEmailInput = {
  agreement: GilmoreAgreementSubmission;
  agreementUrl: string;
  receiptId: string;
  verifiedAt: string;
};

export type CompletedAgreementEmailResult = TransactionalEmailResult & {
  expected: number;
};

const PROVIDER_EMAIL = "amulya@leasemagnets.com";

export async function sendCompletedGilmoreAgreement(
  input: CompletedAgreementEmailInput,
): Promise<CompletedAgreementEmailResult> {
  const recipients = Array.from(
    new Set([input.agreement.email.toLowerCase(), PROVIDER_EMAIL]),
  );
  const message = buildCompletedAgreementEmail(input);
  const delivery = await sendTransactionalEmail({
    to: recipients,
    replyTo: PROVIDER_EMAIL,
    subject:
      "Completed: The Residences at The Gilmore × LeaseMagnets Service Agreement",
    html: message.html,
    text: message.text,
  });

  return { ...delivery, expected: recipients.length };
}

function buildCompletedAgreementEmail(input: CompletedAgreementEmailInput) {
  const { agreement, receiptId, verifiedAt, agreementUrl } = input;
  const customerDate = formatAgreementDate(agreement.date);
  const verifiedTime = formatVerifiedTime(verifiedAt);
  const selectedPackage = packageDetails(agreement.plan);
  const safe = {
    company: escapeHtml(agreement.company),
    packageName: escapeHtml(selectedPackage.name),
    firstInvestment: escapeHtml(selectedPackage.firstInvestment),
    monthly: escapeHtml(selectedPackage.monthly),
    deposit: escapeHtml(selectedPackage.deposit),
    included: escapeHtml(selectedPackage.included),
    name: escapeHtml(agreement.name),
    title: escapeHtml(agreement.title),
    email: escapeHtml(agreement.email),
    phone: escapeHtml(agreement.phone || "Not provided"),
    signature: escapeHtml(agreement.signature),
    customerDate: escapeHtml(customerDate),
    verifiedTime: escapeHtml(verifiedTime),
    receiptId: escapeHtml(receiptId),
    agreementUrl: escapeHtml(agreementUrl),
  };

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Completed Gilmore Service Agreement</title></head>
<body style="margin:0;background:#eef0ef;color:#20332f;font-family:Inter,Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">The Residences at The Gilmore × LeaseMagnets Service Agreement has been completed and email-verified.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef0ef"><tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:700px;background:#ffffff;border:1px solid #d7dcda;border-radius:16px;overflow:hidden">
      <tr><td style="padding:32px 34px;background:#142824;color:#ffffff">
        <div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b9c9c4">LeaseMagnets, Inc.</div>
        <h1 style="margin:12px 0 6px;font-family:Georgia,serif;font-size:32px;line-height:1.08;font-weight:400">Service Agreement Complete</h1>
        <div style="font-size:14px;line-height:1.5;color:#dce5e2">The Residences at The Gilmore · Gilbert, Arizona</div>
      </td></tr>
      <tr><td style="padding:30px 34px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border:1px solid #cfd8d4;border-radius:12px;background:#f3f7f5"><tr>
          <td width="64" align="center" style="padding:18px 8px 18px 18px"><div style="width:42px;height:42px;border-radius:50%;background:#315f51;color:#fff;font-size:24px;line-height:42px;text-align:center">✓</div></td>
          <td style="padding:18px 18px 18px 8px"><div style="font-size:16px;font-weight:700;color:#203d35">Signed and email-verified</div><div style="margin-top:4px;font-size:13px;line-height:1.5;color:#60706a">A Tour one-time code verified ${safe.email} on ${safe.verifiedTime}.</div></td>
        </tr></table>

        <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:23px;font-weight:400;color:#142824">Agreement snapshot</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border-collapse:collapse;font-size:13px;line-height:1.5">
          ${summaryRow("Effective date", "September 23, 2026")}
          ${summaryRow("Property", "The Residences at The Gilmore · 3877 S Quartz St · Gilbert, AZ 85297")}
          ${summaryRow("Selected package", safe.packageName)}
          ${summaryRow("First-production investment", safe.firstInvestment)}
          ${summaryRow("Monthly", safe.monthly)}
          ${summaryRow("Deposit", safe.deposit)}
          ${summaryRow("Included", safe.included)}
          ${summaryRow("Travel", "Not included")}
        </table>

        <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:23px;font-weight:400;color:#142824">Executed by both parties</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:26px"><tr>
          <td width="49%" valign="top" style="padding:18px;border:1px solid #d7dcda;border-radius:10px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7b8783">LeaseMagnets, Inc.</div>
            <div style="margin:24px 0 3px;font-family:Georgia,serif;font-size:25px;font-style:italic;color:#142824">Amulya Parmar</div>
            <div style="border-top:1px solid #56645f;padding-top:8px;font-size:12px;line-height:1.55;color:#56645f"><strong style="color:#263b35">Amulya Parmar</strong><br>CEO &amp; Founder<br><a href="mailto:${PROVIDER_EMAIL}" style="color:#315f51">${PROVIDER_EMAIL}</a><br>Signed September 23, 2026</div>
          </td>
          <td width="2%">&nbsp;</td>
          <td width="49%" valign="top" style="padding:18px;border:1px solid #d7dcda;border-radius:10px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7b8783">${safe.company}</div>
            <div style="margin:24px 0 3px;font-family:Georgia,serif;font-size:25px;font-style:italic;color:#142824">${safe.signature}</div>
            <div style="border-top:1px solid #56645f;padding-top:8px;font-size:12px;line-height:1.55;color:#56645f"><strong style="color:#263b35">${safe.name}</strong><br>${safe.title}<br><a href="mailto:${safe.email}" style="color:#315f51">${safe.email}</a><br>${safe.phone}<br>Signed ${safe.customerDate}</div>
          </td>
        </tr></table>

        <div style="margin:0 0 28px;padding:14px 16px;border-left:3px solid #315f51;background:#f5f7f6;font-size:12px;line-height:1.55;color:#5f6d68"><strong style="color:#263b35">Verification receipt ${safe.receiptId}</strong><br>The signer affirmed that the typed legal signature represents their electronic signature and acceptance of this Agreement.</div>

        <div style="text-align:center;margin-bottom:30px"><a href="${safe.agreementUrl}" style="display:inline-block;padding:13px 21px;border-radius:7px;background:#315f51;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700">View agreement online</a></div>

        ${legalHtml()}
      </td></tr>
      <tr><td style="padding:20px 34px;background:#f6f7f6;border-top:1px solid #dde1df;font-size:11px;line-height:1.55;color:#74807c">This completed copy was generated after verification through Tour and emailed separately to the verified customer address and LeaseMagnets. Questions? Reply to this email or contact <a href="mailto:${PROVIDER_EMAIL}" style="color:#315f51">${PROVIDER_EMAIL}</a>.</td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;

  const text = [
    "LEASEMAGNETS, INC. SERVICE AGREEMENT — COMPLETED COPY",
    "The Residences at The Gilmore · 3877 South Quartz Street · Gilbert, Arizona",
    "Effective September 23, 2026",
    "",
    "SIGNED AND EMAIL-VERIFIED",
    `A Tour one-time code verified ${agreement.email} on ${verifiedTime}.`,
    `Verification receipt: ${receiptId}`,
    "",
    "COMMERCIAL TERMS",
    `Selected package: ${selectedPackage.name}`,
    `First-production investment: ${selectedPackage.firstInvestment}`,
    `Monthly: ${selectedPackage.monthly}`,
    `Deposit: ${selectedPackage.deposit}`,
    `Included: ${selectedPackage.included}`,
    "Travel: not included",
    "",
    "LEASEMAGNETS, INC.",
    "Amulya Parmar",
    "CEO & Founder",
    PROVIDER_EMAIL,
    "Signed September 23, 2026",
    "",
    "CUSTOMER",
    agreement.company,
    `Signature: ${agreement.signature}`,
    `${agreement.name} · ${agreement.title}`,
    agreement.email,
    agreement.phone || "Phone not provided",
    `Signed ${customerDate}`,
    "",
    "The signer affirmed that the typed legal signature represents their electronic signature and acceptance of this Agreement.",
    "",
    `View agreement online: ${agreementUrl}`,
    "",
    legalText(),
  ].join("\n");

  return { html, text };
}

function packageDetails(plan: GilmoreAgreementSubmission["plan"]) {
  if (plan === "tour-vla") {
    return {
      name: "Tour + VLA",
      firstInvestment: "$2,500",
      monthly: "$250 per property / month",
      deposit: "$1,250",
      included: "Guided tour · Video Leasing Agent · Hosting and lead capture",
    };
  }

  if (plan === "growth-actors") {
    return {
      name: "Growth + Actors",
      firstInvestment: "$5,500",
      monthly: "$500 per property / month",
      deposit: "$2,750",
      included:
        "Guided tour · Video Leasing Agent · 3 ad concepts · $3,000 professional actor budget",
    };
  }

  return {
    name: "Growth",
    firstInvestment: "$2,500",
    monthly: "$500 per property / month",
    deposit: "$1,250",
    included:
      "Guided tour · Video Leasing Agent · 3 ad concepts · $300 monthly video-ad spend",
  };
}

function summaryRow(label: string, value: string) {
  return `<tr><td valign="top" style="width:34%;padding:9px 10px 9px 0;border-bottom:1px solid #e4e7e5;color:#78827f">${label}</td><td valign="top" style="padding:9px 0;border-bottom:1px solid #e4e7e5;font-weight:600;color:#283d37">${value}</td></tr>`;
}

const AGREEMENT_INTRO = [
  "This Subscription Agreement (this “Agreement”) is entered into as of the effective date indicated above (“Effective Date”) by and between LeaseMagnets, Inc. (“LeaseMagnets”) and the entity identified on the signature page by name, corporate domicile, and principal address (“Customer”).",
  "LeaseMagnets develops, owns, and licenses separate proprietary information technology solutions (collectively, the “Applications”), which are or shall be hosted by a third party and made available to Customer as a service. LeaseMagnets may, from time to time and at its sole discretion, provide improvements or enhancements to the Applications.",
];

const AGREEMENT_EXECUTION =
  "IN WITNESS WHEREOF, the parties have caused this Agreement to be executed by their duly authorized representatives as of the dates written below.";

type AgreementSection = {
  title: string;
  lead?: string;
  items?: string[];
  paragraphs: string[];
};

const AGREEMENT_SECTIONS: AgreementSection[] = [
  {
    title: "1. Scope of Work",
    lead: "LeaseMagnets will provide digital marketing technology and production solutions for The Residences at The Gilmore (the “Property” and the “Services”), including:",
    items: [
      "One professionally produced, guided video tour per scheduled production package;",
      "An interactive Video Leasing Agent experience built from the approved tour, property information, FAQs, and calls to action;",
      "Three short-form paid and social ad concepts when a Growth package is selected;",
      "A $3,000 professional actor budget when Growth + Actors is selected; and",
      "LeaseMagnets hosting, lead-capture, delivery, updates, and supporting infrastructure.",
    ],
    paragraphs: [
      "Additional services may be provided as mutually agreed upon in writing. Paid media beyond the selected package, campaign placement, actor overages or expanded usage, travel, additional revisions, additional floor plans, photography, Matterport scans, and other services not expressly listed above are excluded unless separately approved in writing.",
      "The license is non-exclusive. LeaseMagnets may grant to others, or reserve for its own use, rights that are the same as or similar to those granted to Customer. This Agreement is personal to Customer, may be used only for Customer’s internal operations, and is non-transferable, non-assignable, and non-sublicensable. With LeaseMagnets’ prior written approval, Customer may permit affiliated entities and authorized service providers to use the Service consistent with this Agreement. Customer remains responsible for the acts and omissions of each party it allows to access or use the Service. Unless otherwise expressly agreed, Customer may use the Service within the United States only.",
    ],
  },
  {
    title: "2. Accessibility and Privacy",
    paragraphs: [
      "At its discretion, LeaseMagnets may use technological and operational methods to understand and support Customer’s use of the Service and to prevent unauthorized use. Customer agrees not to decompile or reverse engineer the Service.",
      "Unless it receives Customer’s prior written consent, LeaseMagnets will not access or use Customer data other than as necessary to facilitate the Service and will not give a third party access to Customer data except to service providers assisting LeaseMagnets in delivering the Service. LeaseMagnets may disclose Customer data as required by applicable law or proper governmental demand and will reasonably cooperate with Customer in any effort to seek a protective order or contest the disclosure, at Customer’s expense.",
    ],
  },
  {
    title: "3. Term of Agreement",
    paragraphs: [
      "This Agreement applies individually to The Residences at The Gilmore and to any additional properties confirmed by email for onboarding. It remains in full force and effect on a yearly basis per property. The date the first monthly plan invoice is paid for a property marks the start of its annual renewal cycle. The Agreement automatically renews each year unless written notice of cancellation is provided in accordance with Section 4.",
    ],
  },
  {
    title: "4. Termination",
    paragraphs: [
      "Either party may terminate this Agreement for an individual property before the start of its next annual cycle with at least 30 days’ advance written notice. If notice is not received before the renewal date, the Agreement renews for another year for that property.",
    ],
  },
  {
    title: "5. Compensation",
    paragraphs: [
      "Customer selects one package on the signature page: (a) Tour + VLA, consisting of the $2,500 guided-tour production package and $250 per property per month for the Video Leasing Agent and supporting technology; (b) Growth, consisting of the $2,500 guided-tour production package and $500 per property per month, including three short-form ad concepts, $300 in monthly video-ad spend, and $200 in technology infrastructure; or (c) Growth + Actors, consisting of the Growth package plus a $3,000 professional actor budget per production, for a $5,500 first-production investment and $500 per property per month.",
      "The $3,000 actor budget replaces the prior travel budget and applies to casting and professional on-camera talent. Travel is not included in any package. Actor overages, expanded usage rights, or travel requested by Customer require written approval and are billed separately.",
      "A deposit equal to 50% of the selected first-production investment is due upon booking and locks the production date: $1,250 for Tour + VLA or Growth, and $2,750 for Growth + Actors. The remaining first-production balance is due upon final delivery unless otherwise agreed in writing.",
      "The first monthly payment is due when the Video Leasing Agent goes live on the Property’s website, with subsequent payments due on the same calendar day each month.",
      "New properties may be added by written confirmation. Each additional property is subject to the selected package. Production, actor, and any separately approved travel fees for each additional property or tour will be confirmed before scheduling.",
      "Customer is responsible for providing LeaseMagnets with Google Tag Manager access or direct embed access to the Property website within 14 days after this Agreement is signed. Customer will also provide accurate, approved property information—including pricing, availability, FAQs, policies, and calls to action—for use by the Video Leasing Agent.",
      "Growth packages include a $300 monthly paid-media allocation. Media spend beyond that allocation, or any media spend under Tour + VLA, requires Customer’s written approval and is billed separately. Additional production costs—including actor overages, location fees, permits, travel, extra revision rounds, professional photography, floor-plan capture, or Matterport services—also require separate written approval.",
    ],
  },
  {
    title: "6. Independent Contractor",
    paragraphs: [
      "LeaseMagnets is acting as an independent contractor in providing the Services, not as an employee. The parties agree that this Agreement does not create a joint venture or partnership between them.",
    ],
  },
  {
    title: "7. Modification of Agreement",
    paragraphs: [
      "Any modification or amendment to this Agreement is binding only when evidenced in writing and signed by each party.",
    ],
  },
  {
    title: "8. Integration",
    paragraphs: [
      "This Agreement contains the entire agreement and understanding between Customer and LeaseMagnets. No representations, promises, agreements, or understandings, written or oral, not contained herein have force or effect.",
    ],
  },
  {
    title: "9. Severability and Late Payments",
    paragraphs: [
      "The provisions of this Agreement are severable. The invalidity or unenforceability of one or more provisions does not affect the validity or enforceability of the remaining provisions. Late payments will incur interest of 2.75% every 30 days, capped at 10% interest, to the extent permitted by applicable law.",
    ],
  },
  {
    title: "10. Indemnity",
    paragraphs: [
      "LeaseMagnets will indemnify and hold Customer, its clients, and their respective directors, officers, members, managers, affiliates, insurers, employees, and agents harmless against damages, costs, and fees reasonably incurred, including attorneys’ fees, arising from a third-party allegation relating to (i) the Services or (ii) LeaseMagnets’ failure to comply with laws applicable to its Services, unless the claim is the direct result of Customer’s gross negligence.",
    ],
  },
];

function legalHtml() {
  const introduction = AGREEMENT_INTRO.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const sections = AGREEMENT_SECTIONS.map((section) => {
    const lead = section.lead ? `<p>${escapeHtml(section.lead)}</p>` : "";
    const items = section.items
      ? `<ul style="padding-left:20px">${section.items.map((item) => `<li style="margin-bottom:5px">${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";
    const paragraphs = section.paragraphs
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
    return `<h3 style="margin:20px 0 5px;color:#203d35">${escapeHtml(section.title)}</h3>${lead}${items}${paragraphs}`;
  }).join("");

  return `<div style="border-top:1px solid #dfe3e1;padding-top:25px;color:#4c5a55;font-family:Georgia,serif;font-size:12px;line-height:1.65">
    <h2 style="margin:0 0 13px;font-family:Georgia,serif;font-size:23px;font-weight:400;color:#142824">Service Agreement</h2>
    ${introduction}${sections}<p style="margin-top:20px;color:#263b35"><strong>${escapeHtml(AGREEMENT_EXECUTION)}</strong></p>
  </div>`;
}

function legalText() {
  const sections = AGREEMENT_SECTIONS.flatMap((section) => [
    "",
    section.title.toUpperCase(),
    ...(section.lead ? [section.lead] : []),
    ...(section.items?.map((item) => `• ${item}`) ?? []),
    ...section.paragraphs,
  ]);
  return ["SERVICE AGREEMENT", ...AGREEMENT_INTRO, ...sections, "", AGREEMENT_EXECUTION].join("\n\n");
}

function formatAgreementDate(value: string) {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function formatVerifiedTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Detroit",
    timeZoneName: "short",
  }).format(parsed);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character,
  );
}
