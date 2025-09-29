// Cranbourne JFC — Bunnings BBQ EOI
// CORS-friendly submit (uses no-cors so the browser won't block/throw)

(function () {
  'use strict';

  var form = document.getElementById('eoiForm');
  var statusEl = document.getElementById('status');

  function getCheckedValues(name) {
    var nodes = document.querySelectorAll('input[name="' + name + '"]:checked');
    var out = [];
    for (var i = 0; i < nodes.length; i++) out.push(nodes[i].value);
    return out;
  }

  function showStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.className = 'status ' + (ok ? 'ok' : 'err');
    statusEl.textContent = msg;
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? (el.value || '').trim() : '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    showStatus('Submitting…', true);

    var name = val('name');
    var email = val('email');
    var phone = val('phone');
    var slots = getCheckedValues('slots');

    if (!name || !email || !phone) {
      showStatus('Please fill in name, email and mobile.', false);
      return;
    }
    if (slots.length === 0) {
      showStatus('Please choose at least one 2-hour slot.', false);
      return;
    }

    var payload = {
      timestamp: new Date().toISOString(),
      eventName: val('eventName') || 'Bunnings BBQ',
      eventLocation: val('eventLocation'),
      eventDate: val('eventDate'),
      name: name,
      email: email,
      phone: phone,
      team: val('team'),
      roles: getCheckedValues('roles'),
      slots: slots,
      notes: val('notes'),
      userAgent: navigator.userAgent
    };

    try {
      // Use no-cors so the browser doesn't block the response (opaque response).
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      // We can’t read the response in no-cors mode, but if no network error was thrown, it was sent.
      showStatus('Thanks — your EOI has been recorded!', true);
      console.log('EOI sent (opaque response due to no-cors). Payload:', payload);
      form.reset();
    } catch (err) {
      console.error('Submit error:', err);
      showStatus('Submission failed: ' + String(err && err.message ? err.message : err).slice(0, 220), false);
    }
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  } else {
    console.warn('EOI form not found: #eoiForm');
  }
})();
