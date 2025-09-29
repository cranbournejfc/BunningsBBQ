// Cranbourne JFC — Bunnings BBQ EOI
// CORS-friendly submit (uses no-cors so the browser won't block/throw)

(function () {
  const form = document.getElementById('eoiForm');
  const statusEl = document.getElementById('status');

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(el => el.value);
  }

  function showStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.className = 'status ' + (ok ? 'ok' : 'err');
    statusEl.textContent = msg;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    showStatus('Submitting…', true);

    // Basic validation
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const slots = getCheckedValues('slots');

    if (!name || !email || !phone) {
      showStatus('Please fill in name, email and mobile.', false);
      return;
    }
    if (slots.length === 0) {
      showStatus('Please choose at least one 2-hour slot.', false);
      return;
    }

    // Build payload (includes event details if present as hidden fields)
    const payload = {
      timestamp: new Date().toISOString(),
      eventName: document.getElementById('eventName')?.value || 'Bunnings BBQ',
      eventLocation: document.getElementById('eventLocation')?.value || '',
      eventDate: document.getElementById('eventDate')?.value || '',
      name,
      email,
      phone,
      team: (document.getElementById('team')?.value || '').trim(),
      roles: getCheckedValues('roles'),
      slots,
      notes: (document.getElementById('notes')?.value || '').trim(),
      userAgent: navigator.userAgent
    };

    try {
      // Use no-cors so the browser doesn't block the response (opaque response).
      // This avoids "Failed to fetch" even though Apps Script doesn't send CORS headers.
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      // We can't read the response in no-cors mode, but if no network error
      // was thrown, the request was sent. Apps Script will append the row.
      showStatus('Thanks — your EOI has been recorded!', true);
      console.log('EOI sent (opaque response due to no-cors). Payload:', payload);
      form.reset();
    } catch (err) {
      console.error('Submit error:', err);
      showStatus('Submission failed: ' + (String(err.message || err)).slice(0, 220), false);
    }
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  } else {
    console.warn('EOI form not found: #eoiForm');
  }
})();
