# VERVE Charlottesville + EVER College Station — AI Chat Service Agreements

Independent AI Chat service-agreement previews at `/proposals/peakmade/verve-ever-ai-chat/index.html`.
Use `?property=verve` or `?property=ever` to open a specific agreement. Each property has all seven requested sections and its own blank bilateral signature blocks. The selected property alone prints in a two-page Letter layout. The eight illustrative conversations remain below the agreement and are excluded from print.
The existing `/proposals/peakmade/verve-ever/index.html` and all other proposals are unchanged.

## Commercial terms and execution

The source AI Chat proposal contains no approved setup fee, recurring fee, contract term or billing schedule. `agreement-config.js` deliberately keeps these fields null for each property; null never means free. Revery's $3,500 production/travel package and $200/month infrastructure fee belong to a different scope and were not copied.

Enter only approved commercial terms in the configuration. Amounts are integer currency minor units; the initial-term total is setup plus recurring payments over the configured term. An invalid amount, currency, billing interval, non-divisible term, or missing payment/renewal/tax terms leaves the agreement in draft status. Each property's configuration is independent.

The page provides blank signature lines for printing and signing after commercial terms are complete. It is not an electronic-signature service, sends no verification emails, stores no signer information, and never displays a pre-signed LeaseMagnets signature. Both parties' legal entities, representatives and dates remain blank.

## Design and experience references

- Existing proposal system: white paper sections, running headers, scope tables and restrained typography. Uses the repository's local Nohemi and Plus Jakarta Sans fonts, official property logos, and property color accents. Responsive document navigation and print styles are isolated to this directory.
- https://partners.leasemagnets.com/ivy-cap/revery-starkville — inspected September 5, 2026. Used the agreement flow, itemized commercial terms and bilateral signature structure as a reference. Its embedded Bellamy Tour.Video example and video-production scope do not establish extra AI Chat capabilities or approved pricing for VERVE/EVER.
- https://www.sparqonrio.com/ — inspected live September 5, 2026. Observed Tour-branded website chat launcher; property-specific leasing assistant dialog; suggested tour, neighborhood and amenity prompts; question input; Tour attribution. No prospect information or chat messages submitted.
- Existing Sparq on Rio AI Chat Concierge proposal: property answers followed by relevant leasing actions. No performance, integration, pricing or timing claims were carried over.

## Official property sources — checked September 5, 2026

| Source | Details used |
| --- | --- |
| https://verve-charlottesville.com/ | “Live your best damn life”; Fall 2027; studios through four bedrooms; furnished apartments; UVA grounds / The Corner; 100 Stadium Road community / 919 W. Main Street leasing office |
| https://verve-charlottesville.com/amenities/ | Pool, study lounge, golf simulator, sauna, sky lounge, sky deck |
| https://evercollegestation.com/ | “The Future Is Yours”; Fall 2027; furnished apartments; pool, wellness suite, study lounge, podcast room, media room, micro market; 401 Stasney Street community / 321 University Drive leasing office |
| https://evercollegestation.com/faqs/ | Studio through five-bedroom layouts; Northgate location near Texas A&M |

Brand colors sampled from each official site's linked `theme.1.css`: VERVE brick `#5f1d0f` and paper `#f3ebe0`; EVER blue `#c8d4e8`, linen `#f3ebdf`, olive `#a99f01`, dark brown `#3a2d2a`. Local logos are unmodified source SVGs.

## Asset provenance

- `verve-logo.svg`: https://verve-charlottesville.com/wp-content/uploads/2026/05/verve_Charlottesville_RGB_Brick.svg
- `ever-logo.svg`: https://evercollegestation.com/wp-content/uploads/2026/05/ever_CollegeStation_RGB_K.svg
- `verve-clubroom.webp`: https://verve-charlottesville.com/wp-content/themes/yootheme/cache/81/586_E1_Clubroom_still_result-1-811c4e94.webp
- `ever-exterior.webp`: https://evercollegestation.com/wp-content/themes/yootheme/cache/69/ever-college-station-rendering-587__F_Exterior-696d3c04.webp
- LeaseMagnets wordmark and favicon reuse existing `/logos/` assets. Renderings are retained as existing assets but are not used in the agreement layout.

## Content boundaries

The page previews proposed service agreements, not installed chat services. Its eight conversations are scripted, labeled examples. It collects no data and sends no messages. Current apartment rates and availability are referred to each property's live leasing sources. Opening and amenity information describes the websites' advertised plans, not completed construction. EV charging is a knowledge topic, not a claim that either property has confirmed operational chargers. Unconfirmed information requires leasing-team confirmation.

Included functions are the website chat interface, property Q&A, suggested questions, relevant leasing links and direction to the leasing team. Live inventory, confirmed calendar bookings, CRM sync, automated follow-up, video production and ads are outside the stated scope. No conversion metrics, delivery deadline, support schedule or uptime promise is introduced.

## Validation — September 5, 2026

- All fourteen sections, four signature blocks, unique IDs and local asset/font paths checked.
- Both property deep links and all eight scripted question/action combinations exercised in the browser; no browser errors or warnings.
- Desktop and 375/390px mobile layouts visually reviewed; no horizontal overflow; mobile signature blocks stack vertically.
- Exact print rules reviewed in a temporary Letter-width browser fixture: both properties fit two pages, with paired signature blocks and page footers inside the page boundaries. Browser PDF export itself is not automated here.
- Official property home, amenities, FAQ, contact, floor-plan and EVER availability destinations verified in the browser. Direct Python requests received site-level 403 responses; authenticated browser loads succeeded. Revery and Sparq references also opened successfully.
- Pricing calculation checks cover configured totals, explicit zero versus missing fees, invalid intervals/currency, overflow, incomplete commercial terms and isolation between properties. Test-only amounts never enter production configuration.

All files for this version live in this directory. No global styles, dependencies, routing or existing pages need modification.
