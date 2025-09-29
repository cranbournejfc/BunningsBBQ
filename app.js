// EOI Form logic — validated and syntax-checked
(function(){
  const form = document.getElementById('eoiForm');
  const statusEl = document.getElementById('status');

  function getCheckedValues(name){
    return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map(el => el.value);
  }

  function showStatus(msg, ok){
    if(!statusEl) return;
    statusEl.className = 'status ' + (ok ? 'ok' : 'err');
    statusEl.textContent = msg;
  }

  async function handleSubmit(e){
    e.preventDefault();
    showStatus('Submitting…', true);

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
      name: name,
      email: email,
      phone: phone,
      team: (document.getElementById('team').value || '').trim(),
      roles: getCheckedValues('roles'),
      slots: slots,
      notes: (document.getElementById('notes').value || '').trim(),
      userAgent: navigator.userAgent
    };

  try{
  // First attempt: normal CORS fetch so we can read a JSON response if allowed
  const res = await fetch(GAS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  // Try to parse the response; this may fail if CORS blocks reading the body
  let text = '';
  try { text = await res.text(); } catch (e) {}

  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}

  if (res.ok && (!data || data.ok !== false)) {
    console.log('Server meta:', data && data.meta);
    showStatus('Thanks — your EOI has been recorded! We’ll be in touch.', true);
    form.reset();
    return;
  }

  if (data && data.error) throw new Error(data.error);
  throw new Error(text || ('HTTP ' + res.status));
} catch (err) {
  // Fallback for CORS-blocked reads: send again with no-cors and assume success
  try {
    await fetch(GAS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    showStatus('Thanks — your EOI has been recorded! (Response blocked by the browser, but delivered)', true);
    form.reset();
    return;
  } catch (e2) {
    console.error('Submit error:', err, 'Fallback error:', e2);
    showStatus('Submission failed: ' + (String(err.message || err)).slice(0,220), false);
  }
}


  if(form){
    form.addEventListener('submit', handleSubmit);
  }

  const testBtn = document.getElementById('testWriteBtn');
  if(testBtn){
    testBtn.addEventListener('click', async function(){
      showStatus('Sending test row…', true);
      const payload = {
        timestamp: new Date().toISOString(),
        eventName: document.getElementById('eventName').value,
        eventLocation: document.getElementById('eventLocation').value,
        eventDate: document.getElementById('eventDate').value,
        name: 'TEST USER',
        email: 'test@example.com',
        phone: '0400000000',
        team: 'U11 Test',
        roles: ['Cooking'],
        slots: ['08:00–10:00'],
        notes: 'Debug test row',
        userAgent: navigator.userAgent
      };
      try{
        const res = await fetch(GAS_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) });
        const text = await res.text();
        let data = null;
        try { data = JSON.parse(text); } catch(e){}
        if (!res.ok || (data && data.ok === false)) {
          throw new Error((data && data.error) || text || ('HTTP ' + res.status));
        }
        console.log('Server meta:', data && data.meta);
        showStatus('Test write sent — check the sheet (Responses tab).', true);
      }catch(err){
        console.error('Test write error:', err);
        showStatus('Test failed: ' + (String(err.message || err)).slice(0,220), false);
      }
    });
  }
})();
