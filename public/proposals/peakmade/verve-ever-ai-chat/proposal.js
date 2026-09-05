/* Scripted proposal examples. No AI requests, lead collection or external writes. */
(() => {
  const properties = {
    verve: {
      name: 'VERVE Charlottesville',
      base: 'https://verve-charlottesville.com',
      examples: {
        visit: ['When does VERVE open, and where can I visit?', 'VERVE Charlottesville is coming Fall 2027. The community address is 100 Stadium Road; the leasing office is at 919 W. Main Street. Want to connect with the team about a visit?', 'Connect with leasing', '/contact/'],
        plans: ['What layouts can I explore at VERVE?', 'VERVE lists studios and one-, two-, three- and four-bedroom floor plans, with fully furnished apartments. Explore the layouts to see which one suits your plans for Charlottesville.', 'Explore floor plans', '/floor-plans/'],
        amenities: ['What is there to do beyond my apartment?', 'The planned amenities include a pool, study lounge, golf simulator, sauna, sky lounge and sky deck. You can explore the spaces on VERVE’s amenities page.', 'Explore the amenities', '/amenities/'],
        rates: ['What are the current rates and available rooms?', 'For current rates and availability, please check VERVE’s floor-plan page or contact the leasing team. They can confirm the latest options for your move-in plans.', 'Check floor plans', '/floor-plans/']
      }
    },
    ever: {
      name: 'EVER College Station',
      base: 'https://evercollegestation.com',
      examples: {
        visit: ['When does EVER open, and where can I visit?', 'EVER College Station is coming Fall 2027. The community address is 401 Stasney Street in Northgate; the leasing office is at 321 University Drive. Want to connect with the team about a visit?', 'Connect with leasing', '/contact/'],
        plans: ['What layouts can I explore at EVER?', 'EVER’s FAQs list studios through five-bedroom options, and its website describes fully furnished apartments. Take a look at the floor plans, then ask the leasing team about current options.', 'Explore floor plans', '/floor-plans/'],
        amenities: ['Is there space to study, recharge and create?', 'EVER’s planned amenities include a study lounge, wellness suite, podcast room, media room, pool and micro market. Explore the amenities to get a feel for life beyond your apartment.', 'Explore the amenities', '/amenities/'],
        rates: ['What are the current rates and available rooms?', 'For current rates and availability, please check EVER’s availability page or contact the leasing team. They can confirm the latest options for your move-in plans.', 'Check availability', '/availability/']
      }
    }
  };
  const propertyFromURL = () => {
    const key = new URL(location.href).searchParams.get('property');
    return Object.hasOwn(properties, key) ? key : 'verve';
  };
  let selectedProperty = propertyFromURL();
  let selectedTopic = 'visit';
  const demo = document.querySelector('.demo');
  const propertyButtons = Array.from(document.querySelectorAll('[data-select-property]'));
  const topicButtons = Array.from(document.querySelectorAll('.question-switch button'));
  const action = document.getElementById('chat-action');
  function render() {
    const property = properties[selectedProperty];
    const [question, answer, label, path] = property.examples[selectedTopic];
    demo.dataset.property = selectedProperty;
    document.getElementById('assistant-name').textContent = property.name;
    document.getElementById('chat-question').textContent = question;
    document.getElementById('chat-answer').textContent = answer;
    action.href = property.base + path;
    action.replaceChildren(document.createTextNode(label + ' '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    action.append(arrow);
    document.body.dataset.property = selectedProperty;
    document.title = `${property.name} · AI Chat Service Agreement · LeaseMagnets`;
    document.querySelectorAll('.agreement').forEach(article => { article.hidden = article.dataset.property !== selectedProperty; });
    propertyButtons.forEach(button => {
      if (button.dataset.selectProperty === selectedProperty) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-section]').forEach(link => { link.href = `#${selectedProperty}-section-${link.dataset.section}`; });
    renderPricing();
    topicButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === selectedTopic)));
  }
  function renderPricing() {
    const config = globalThis.AI_CHAT_PRICING?.[selectedProperty] || {};
    const article = document.querySelector(`.agreement[data-property="${selectedProperty}"]`);
    const positiveInteger = value => Number.isSafeInteger(value) && value > 0;
    const amount = value => Number.isSafeInteger(value) && value >= 0;
    const text = value => typeof value === 'string' && value.trim().length > 0;
    let money;
    try {
      if (typeof config.currency === 'string' && /^[A-Z]{3}$/.test(config.currency)) {
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: config.currency });
        const divisor = 10 ** formatter.resolvedOptions().maximumFractionDigits;
        money = value => formatter.format(value / divisor);
      }
    } catch { /* An invalid currency keeps commercial terms pending. */ }
    const canTotal = Boolean(money && amount(config.setupMinor) && amount(config.recurringMinor)
      && positiveInteger(config.intervalMonths) && positiveInteger(config.termMonths)
      && config.termMonths % config.intervalMonths === 0);
    const total = canTotal ? config.setupMinor + config.recurringMinor * (config.termMonths / config.intervalMonths) : null;
    const validTotal = canTotal && Number.isSafeInteger(total);
    const ready = validTotal && text(config.paymentSchedule) && text(config.renewalCancellation) && text(config.taxTreatment);
    const set = (key, value) => { article.querySelector(`[data-price="${key}"]`).textContent = value; };
    set('setup', money && amount(config.setupMinor) ? money(config.setupMinor) : 'To be confirmed');
    set('recurring', money && amount(config.recurringMinor) && positiveInteger(config.intervalMonths)
      ? `${money(config.recurringMinor)} / ${config.intervalMonths === 1 ? 'month' : `${config.intervalMonths} months`}` : 'To be confirmed');
    set('term', positiveInteger(config.termMonths) ? `${config.termMonths} ${config.termMonths === 1 ? 'month' : 'months'}` : 'To be confirmed');
    set('total', validTotal ? money(total) : 'Pending fees & term');
    set('explanation', validTotal
      ? `Setup ${money(config.setupMinor)} + ${config.termMonths / config.intervalMonths} recurring payments of ${money(config.recurringMinor)}. Tax treatment is specified below.`
      : 'Initial-term total = setup + recurring payments over the agreed term. Fees remain unconfirmed.');
    set('payment', text(config.paymentSchedule) ? config.paymentSchedule : 'To be agreed in writing');
    set('renewal', text(config.renewalCancellation) ? config.renewalCancellation : 'To be agreed in writing');
    set('tax', text(config.taxTreatment) ? config.taxTreatment : 'To be agreed in writing');
    article.querySelector('[data-commercial-note]').textContent = ready ? 'Commercial terms apply to this property only.' : 'Pricing and billing terms require written confirmation before signature.';
    article.querySelector('[data-document-status]').textContent = ready ? 'For review & signature' : 'Draft · commercial terms pending';
    article.querySelector('[data-acceptance]').textContent = ready ? 'Signatures are to be completed by authorized representatives of both parties.' : 'Draft for review. Complete Section 04 before either party signs.';
    article.querySelector('[data-footer-status]').textContent = ready ? 'For review & signature' : 'Draft for review';
    document.getElementById('review-status').textContent = ready ? 'For review & signature' : 'Draft for review';
    document.getElementById('review-detail').textContent = ready ? 'Review all seven sections before both parties sign.' : 'Approved fees and billing terms are required before signature.';
  }
  propertyButtons.forEach(button => button.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    selectedProperty = button.dataset.selectProperty;
    const url = new URL(location.href);
    url.searchParams.set('property', selectedProperty);
    url.hash = '';
    history.pushState({}, '', url);
    render();
  }));
  topicButtons.forEach(button => button.addEventListener('click', () => { selectedTopic = button.dataset.topic; render(); }));
  window.addEventListener('popstate', () => { selectedProperty = propertyFromURL(); render(); });
  document.getElementById('print-agreement').addEventListener('click', () => window.print());
  render();
})();
