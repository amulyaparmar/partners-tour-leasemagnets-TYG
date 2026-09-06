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
  let selectedProperty = 'verve';
  let selectedTopic = 'visit';
  const demo = document.querySelector('.demo');
  const propertyButtons = Array.from(document.querySelectorAll('.property-switch button'));
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
    propertyButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.property === selectedProperty)));
    topicButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === selectedTopic)));
  }
  propertyButtons.forEach(button => button.addEventListener('click', () => { selectedProperty = button.dataset.property; render(); }));
  topicButtons.forEach(button => button.addEventListener('click', () => { selectedTopic = button.dataset.topic; render(); }));
})();
