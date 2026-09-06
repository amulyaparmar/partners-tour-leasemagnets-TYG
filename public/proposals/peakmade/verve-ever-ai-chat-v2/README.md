# VERVE + EVER · AI Chat proposal v2

Independent version at `/proposals/peakmade/verve-ever-ai-chat-v2/index.html`.
The existing `verve-ever-ai-chat` and `verve-ever` proposals are unchanged.

## Design and references

- Exact first-proposal `proposal.css`, `proposal.js`, assets and first three content sections, from commit `8821631475c2ace965a62cc2af6de8ab0668df07` (restored in `fbeeda7`).
- `agreement.css` adds styles for the pricing, agreement and signature sections using the same typography, colors and components.
- Sparq on Rio is the AI Chat product reference: branded assistant, greeting, suggested questions, conversational input and leasing actions. The chat preview here is scripted; no live assistant is deployed by this proposal.
- Revery Starkville supplies only the proposal → agreement → signature sequence. No Revery pricing, bundle, client data, signature, billing terms or verification API was reused.
- Official VERVE Charlottesville and EVER College Station sites supply property details. Sources are linked in page 4; reviewed September 6, 2026.

## Edit sample pricing

Edit **`pricing-config.js` only**. Amounts are USD cents:

```js
illustrationMonths: 12,
properties: {
  verve: { setupCents: 50000, monthlyCents: 25000 },
  ever: { setupCents: 50000, monthlyCents: 25000 }
}
```

These are user-authorized placeholders, not final commercial terms.
Each property: $500 setup + $250/month; $3,500 over the sample 12-month illustration.
Combined: $1,000 setup + $500/month; $7,000 over the sample 12-month illustration.
All visible amounts and illustration-period labels are computed from this config.
Zero is supported explicitly; missing, negative or invalid amounts fail closed and prevent preparing/printing through the page controls.
The illustration period is not an agreed subscription term. Keep `sample: true`.

## Agreement and review behavior

This is a **sample, non-executable agreement layout**. Legal entities and final fees, billing, term, renewal/cancellation, support and launch timing remain to be confirmed. No signatures or dates are prefilled.

The client can enter representatives and titles, acknowledge the sample status, and prepare a local review copy. Signature and date lines remain blank. Print / save PDF uses the browser's native print dialog and retains the sample labels. No form data is transmitted, persisted or used to initiate service. Reload clears entries. This flow does not execute or verify an electronic signature.

To issue a final agreement, review and replace the sample commercial terms, confirm legal parties and implement an approved signing process. Changing prices alone does not make this document executable.

## Validation

Serve the repository's `public` folder with a static server. Check desktop/mobile, both properties' four example topics, internal/external links, assets, pricing totals and blank/valid/edited review form states. Print styles retain the first proposal design and add two agreement pages. No dependencies or build step are needed for these static files.
