/* SAMPLE PRICING ONLY. Edit amounts here; every displayed figure is calculated
   from this configuration. Values are USD cents to avoid rounding drift.
   Updating amounts does not make this sample an executable agreement. */
window.AI_CHAT_SAMPLE_PRICING = Object.freeze({
  sample: true,
  currency: 'USD',
  illustrationMonths: 12, // Illustration only, not an agreed subscription term.
  properties: Object.freeze({
    verve: Object.freeze({ setupCents: 50000, monthlyCents: 25000 }),
    ever: Object.freeze({ setupCents: 50000, monthlyCents: 25000 })
  })
});
