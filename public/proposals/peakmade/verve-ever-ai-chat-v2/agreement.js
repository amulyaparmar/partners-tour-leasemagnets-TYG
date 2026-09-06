(function () {
  'use strict';

  function calculatePricing(config) {
    if (!config || config.sample !== true || config.currency !== 'USD' ||
        !Number.isSafeInteger(config.illustrationMonths) || config.illustrationMonths < 1) {
      throw new Error('A valid USD sample pricing configuration is required.');
    }
    var result = { months: config.illustrationMonths, combined: { setup: 0, monthly: 0, total: 0 } };
    ['verve', 'ever'].forEach(function (key) {
      var property = config.properties && config.properties[key];
      if (!property || !Number.isSafeInteger(property.setupCents) || property.setupCents < 0 ||
          !Number.isSafeInteger(property.monthlyCents) || property.monthlyCents < 0) {
        throw new Error('Both properties require nonnegative setup and monthly amounts in cents.');
      }
      var total = property.setupCents + property.monthlyCents * result.months;
      if (!Number.isSafeInteger(total)) throw new Error('Sample total exceeds supported precision.');
      result[key] = { setup: property.setupCents, monthly: property.monthlyCents, total: total };
      Object.keys(result.combined).forEach(function (fee) {
        result.combined[fee] += result[key][fee];
        if (!Number.isSafeInteger(result.combined[fee])) throw new Error('Combined total exceeds supported precision.');
      });
    });
    return result;
  }

  // Expose only the pure calculation when running the verification script in Node.
  if (typeof module !== 'undefined' && module.exports) module.exports = { calculatePricing: calculatePricing };
  if (typeof document === 'undefined') return;

  var prepare = document.getElementById('prepare-review');
  var print = document.getElementById('print-review');
  var status = document.getElementById('review-status');
  var form = document.getElementById('review-form');
  form.reset();
  var validPricing = false;
  var prepared = false;
  var format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 });

  try {
    var prices = calculatePricing(window.AI_CHAT_SAMPLE_PRICING);
    document.querySelectorAll('[data-price]').forEach(function (element) {
      var keys = element.dataset.price.split('.');
      element.textContent = format.format(prices[keys[0]][keys[1]] / 100);
    });
    document.querySelectorAll('[data-months]').forEach(function (element) { element.textContent = prices.months; });
    validPricing = true;
    prepare.disabled = false;
    print.disabled = false;
  } catch (error) {
    document.querySelectorAll('[data-price]').forEach(function (element) { element.textContent = 'To confirm'; });
    document.getElementById('pricing-error').hidden = false;
    prepare.disabled = true;
    print.disabled = true;
    status.textContent = 'Sample pricing must be corrected before a review copy can be prepared.';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validPricing || !form.reportValidity()) return;
    var fields = Array.from(form.querySelectorAll('input[type="text"][required]'));
    var empty = fields.find(function (field) { return !field.value.trim(); });
    if (empty) {
      empty.setCustomValidity('Enter a name, title or legal entity for this review copy.');
      empty.reportValidity();
      return;
    }
    prepared = true;
    status.textContent = 'Review copy prepared. Sample prices and terms remain non-final. Nothing has been signed or submitted.';
  });

  form.addEventListener('input', function (event) {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    if (prepared) {
      prepared = false;
      status.textContent = 'Review details changed. Prepare the review copy again when ready. Nothing has been signed or submitted.';
    }
  });

  print.addEventListener('click', function () { if (validPricing) window.print(); });
})();
