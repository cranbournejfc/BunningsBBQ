// Handle submit
const form = document.getElementById('eoiForm');
const statusEl = document.getElementById('status');

function getCheckedValues(name){
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function showStatus(msg, ok=false){
  statusEl.className = 'status ' + (ok ? 'ok' : 'err');
  statusEl.textContent = msg;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showStatus('Submitting…', true);

  // Basic validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if(!name || !email || !phone){
    showStatus('Please fill in name, email and mobile.', false);
    return;
  }
  const slots = getCheckedValues('slots');
  if(slots.length === 0){
    showStatus('Please choose at least one 2-hour slot.', false);
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    eventName: document.getElementById('eventName').value,
    eventLocation: document.getElementById('eventLocation').value,
    eventDate: document.getElementById('eventDate').value,
    name,
    email,
    phone,
    team: document.getElementById('team').value.trim(),
    roles: getCheckedValues('roles'),
    slots,
    notes: document.getElementById('notes').value.trim(),
    userAgent: navigator.userAgent
  };

  try{
    const res = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      // Intentionally omit Content-Type to avoid CORS preflight; Apps Script reads raw body fine.
      body: JSON.stringify(payload)
    });
    const text = await res.text(); // raw text for diagnostics
    let data = null;
    try { data = JSON.parse(text); } catch (e) {}
    if (!res.ok || (data && data.ok === false)) {
      const msg = (data && data.error) ? data.error : (text || `HTTP ${res.status}`);
      throw new Error(msg);
    }
    showStatus('Thanks — your EOI has been recorded! We’ll be in touch.', true);
    form.reset();
  }catch(err){
    console.error('Submit error:', err);
    showStatus(`Submission failed: ${String(err).message || String(err)}`.slice(0,220), false);
  }
});
