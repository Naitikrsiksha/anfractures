
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const CONFIG = window.APP_CONFIG || {};
const LS = {
  theme: 'an_theme', lang: 'an_lang', name: 'an_name', health: 'an_health_user', cart: 'an_cart', feedback: 'an_feedback', logs: 'an_logs', rating: 'an_agent_rating'
};
const ITEMS = [
  { id:'belt', price:650, icon:'fa-bandage', label:'item_belt', desc:'item_belt_desc' },
  { id:'wheelchair', price:6200, icon:'fa-wheelchair', label:'item_wheelchair', desc:'item_wheelchair_desc' },
  { id:'support', price:480, icon:'fa-heart-circle-plus', label:'item_support', desc:'item_support_desc' },
  { id:'cane', price:390, icon:'fa-walking', label:'item_cane', desc:'item_cane_desc' },
  { id:'crutch', price:1100, icon:'fa-person-walking-with-cane', label:'item_crutch', desc:'item_crutch_desc' },
  { id:'collar', price:520, icon:'fa-necklace', label:'item_collar', desc:'item_collar_desc' },
  { id:'commode', price:3400, icon:'fa-toilet', label:'item_commode', desc:'item_commode_desc' },
  { id:'stool', price:850, icon:'fa-bath', label:'item_stool', desc:'item_stool_desc' }
];
const DEFAULT_FEEDBACK = [
  { name:'Aman', text:'Great routing and quick response.' },
  { name:'Riya', text:'Clear appointment flow and doctor contact.' },
  { name:'Aastha', text:'Health care gate feels organized.' }
];
let lang = localStorage.getItem(LS.lang) || 'en';
let cart = JSON.parse(localStorage.getItem(LS.cart) || '[]');
let healthUnlocked = false;
let agentRating = Number(localStorage.getItem(LS.rating) || 0);
let chatMode = 'assistant';

function t(key){ return (window.I18N?.[lang] || window.I18N.en)[key] || (window.I18N.en[key] || key); }
function saveJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function loadJSON(k, fallback){ try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); } catch { return fallback; } }
function nowLabel(){ return new Date().toLocaleString([], {dateStyle:'medium', timeStyle:'short'}); }
function validPhone(v){ return /^\d{10}$/.test((v||'').replace(/\D/g,'')); }
function byId(id){ return document.getElementById(id); }
function addLog(type, payload){
  const logs = loadJSON(LS.logs, []);
  logs.unshift({ type, payload, ts: new Date().toISOString() });
  saveJSON(LS.logs, logs.slice(0, 200));
  const body = { action:'logEvent', type, payload, ts: new Date().toISOString() };
  if (CONFIG.SHEETS_ENDPOINT && !CONFIG.SHEETS_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
    fetch(CONFIG.SHEETS_ENDPOINT, { method:'POST', body: JSON.stringify(body), mode:'no-cors' }).catch(()=>{});
  }
}
function updateTexts(){
  $$('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); el.textContent = t(key); });
  $$('[data-i18n-placeholder]').forEach(el => { const key = el.getAttribute('data-i18n-placeholder'); el.placeholder = t(key); });
  document.documentElement.lang = lang;
  document.querySelectorAll('#langSwitch button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  document.querySelectorAll('#themeSwitch button').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === (document.documentElement.dataset.theme || 'dark')));
}
function setTheme(theme){ document.documentElement.dataset.theme = theme; localStorage.setItem(LS.theme, theme); updateLogoTheme(); updateTexts(); }
function updateLogoTheme(){ /* handled by css */ }
function setLang(next){ lang = next; localStorage.setItem(LS.lang, next); updateTexts(); renderCatalog(); renderFeedback(); seedQuickReplies(); }
function appendBubble(container, who, text){
  const el = document.createElement('div');
  el.className = `bubble ${who}`;
  el.innerHTML = `${text}<span class="meta">${nowLabel()}</span>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}
function typing(container){
  const el = document.createElement('div');
  el.className = 'bubble assistant';
  el.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}
function routerReply(text){
  const q = text.toLowerCase();
  if (q.includes('appointment') || q.includes('अपॉइंट') || q.includes('नियोजन') || q.includes('بْر؟') ) {
    document.getElementById('appointment').scrollIntoView({behavior:'smooth'});
    return 'Appointment form opened below. Fill name, phone, date, and issue.';
  }
  if (q.includes('health') || q.includes('health care') || q.includes('आरोग') || q.includes('صحت')) {
    document.getElementById('healthcare').scrollIntoView({behavior:'smooth'});
    if (!healthUnlocked) {
      byId('healthModal').classList.add('open');
      return 'Health Care is locked until name and phone are entered.';
    }
    return 'Health Care chat is ready.';
  }
  if (q.includes('order') || q.includes('buy') || q.includes('ऑर्डर') || q.includes('آرڈر')) {
    document.getElementById('order').scrollIntoView({behavior:'smooth'});
    return 'Order section opened. Medicines are disabled.';
  }
  if (q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('नंबर') || q.includes('فون')) {
    return `Doctor number is available on the top bar. Call button is live.`;
  }
  if (q.includes('complaint')) return 'Complaint section is ready below.';
  if (q.includes('feedback')) return 'Feedback section is below for user and agent feedback.';
  if (q.includes('jhut') || q.includes('think') || q.includes('thinking')) return 'Agent thinking animation is active.';
  return 'I have logged your message and will route it to the correct section if needed.';
}
function healthReply(text){
  const q = text.toLowerCase();
  if (q.includes('fever') || q.includes('bukhar') || q.includes('बुखार') || q.includes('بخار')) return 'General support: rest, hydration, and monitor temperature. Seek a clinician if symptoms are severe or persistent.';
  if (q.includes('pain') || q.includes('dard') || q.includes('दर्द') || q.includes('درد')) return 'Share location, duration, and severity. If pain is severe, sudden, or with swelling, contact a clinician.';
  if (q.includes('breath') || q.includes('saans') || q.includes('सांस') || q.includes('سانس')) return 'Breathing difficulty needs urgent medical help. Use emergency services in your area.';
  return 'Please share symptoms, duration, age, and any red flags. I can help structure the next step.';
}
function renderChat(){
  const log = byId('chatLog');
  log.innerHTML='';
  appendBubble(log,'assistant','Welcome. Ask for appointment, health care, or order help.');
}
function renderHealth(){
  const log = byId('healthLog');
  if (!log) return;
  log.innerHTML='';
  appendBubble(log,'assistant','Health Care area is private and separate from clinic ordering.');
}
function seedQuickReplies(){
  const q = byId('quickReplies');
  q.innerHTML='';
  ['appointment','health care','order','doctor number','feedback'].forEach(label => {
    const b = document.createElement('button');
    b.className = 'ghost btn';
    b.textContent = label;
    b.onclick = () => { byId('chatInput').value = label; sendChat(); };
    q.appendChild(b);
  });
}
function sendChat(){
  const input = byId('chatInput');
  const text = input.value.trim();
  if (!text) return;
  appendBubble(byId('chatLog'),'user',text);
  input.value='';
  addLog('chat', { mode:'assistant', text });
  const thinking = typing(byId('chatLog'));
  setTimeout(() => {
    thinking.remove();
    const reply = routerReply(text);
    appendBubble(byId('chatLog'),'assistant',reply);
    addLog('assistant_reply', { text, reply, opened: detectRoute(text) });
    if (/appointment/i.test(text)) openSection('appointment');
    if (/health|आरोग|صحت/i.test(text)) openSection('healthcare');
    if (/order|ऑर्डर|آرڈر/i.test(text)) openSection('order');
  }, 500);
}
function detectRoute(text){
  const q = text.toLowerCase();
  if (q.includes('appointment')) return 'appointment';
  if (q.includes('health')) return 'healthcare';
  if (q.includes('order')) return 'order';
  return '';
}
function sendHealth(){
  const input = byId('healthInput');
  const text = input.value.trim();
  if (!text || !healthUnlocked) return;
  appendBubble(byId('healthLog'),'user',text);
  input.value='';
  addLog('health_chat', { text });
  const thinking = typing(byId('healthLog'));
  setTimeout(() => {
    thinking.remove();
    const reply = healthReply(text);
    appendBubble(byId('healthLog'),'assistant',reply);
    addLog('health_reply', { text, reply });
  }, 500);
}
function openSection(id){ document.getElementById(id).scrollIntoView({behavior:'smooth', block:'start'}); }
function renderCatalog(){
  const root = byId('catalog');
  root.innerHTML='';
  ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className='item';
    div.innerHTML = `
      <div class="top">
        <div class="ico"><i class="fa-solid ${item.icon}"></i></div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
            <strong>${t(item.label)}</strong><span class="price">${CONFIG.CURRENCY}${item.price}</span>
          </div>
          <div class="muted" style="font-size:.92rem">${t(item.desc)}</div>
          <div class="pill" style="margin-top:8px">${t('item_tag')}</div>
        </div>
      </div>
      <button class="btn primary add"><i class="fa-solid fa-plus"></i>${t('add')}</button>
    `;
    div.querySelector('.add').onclick = () => addItem(item.id);
    root.appendChild(div);
  });
  renderCart();
}
function addItem(id){
  const found = cart.find(x => x.id === id);
  if (found) found.qty += 1; else cart.push({ id, qty:1 });
  saveJSON(LS.cart, cart);
  renderCart();
  addLog('cart_add', { id });
}
function changeQty(id, delta){
  const found = cart.find(x => x.id === id);
  if (!found) return;
  found.qty += delta;
  if (found.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveJSON(LS.cart, cart);
  renderCart();
}
function renderCart(){
  const root = byId('cartItems');
  const total = cart.reduce((s, row) => s + ((ITEMS.find(i => i.id === row.id)?.price || 0) * row.qty), 0);
  byId('cartTotal').textContent = `${CONFIG.CURRENCY}${total}`;
  root.innerHTML = '';
  if (!cart.length){ root.innerHTML = `<div class="muted">Cart is empty.</div>`; return; }
  cart.forEach(row => {
    const item = ITEMS.find(i => i.id === row.id);
    const el = document.createElement('div');
    el.className='cart-row';
    el.innerHTML = `<div><strong>${t(item.label)}</strong><div class="muted">${CONFIG.CURRENCY}${item.price} × ${row.qty}</div></div>
      <div class="qty"><button>−</button><strong>${row.qty}</strong><button>+</button></div>
      <button class="btn ghost" style="padding:10px 12px">${t('remove')}</button>`;
    const [minus, plus] = el.querySelectorAll('.qty button');
    minus.onclick = () => changeQty(row.id, -1);
    plus.onclick = () => changeQty(row.id, 1);
    el.querySelector('.btn').onclick = () => { cart = cart.filter(x => x.id !== row.id); saveJSON(LS.cart, cart); renderCart(); };
    root.appendChild(el);
  });
}
function renderFeedback(){
  const list = byId('feedbackList');
  const saved = loadJSON(LS.feedback, DEFAULT_FEEDBACK);
  list.innerHTML = '';
  saved.slice(0,6).forEach(item => {
    const box = document.createElement('div');
    box.className='card-inner';
    box.innerHTML = `<strong>${item.name}</strong><div class="muted" style="margin-top:6px">${item.text}</div>`;
    list.appendChild(box);
  });
}
function syncDoctorInfo(){
  byId('doctorCall').href = `tel:+${CONFIG.DOCTOR_PHONE || '919999999999'}`;
  byId('callDoctorBtn').href = `tel:+${CONFIG.DOCTOR_PHONE || '919999999999'}`;
  byId('doctorName').textContent = CONFIG.DOCTOR_NAME || 'Doctor';
  byId('doctorRole').textContent = 'Orthopaedics';
  byId('clinicAddress').textContent = CONFIG.CLINIC_ADDRESS || '';
  byId('waBtn').href = `https://wa.me/${(CONFIG.WHATSAPP_PHONE || '').replace(/\D/g,'')}?text=${encodeURIComponent('Hello, I need help.')} `;
}
function sendToSheets(action, payload){
  addLog(action, payload);
  if (CONFIG.SHEETS_ENDPOINT && !CONFIG.SHEETS_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
    fetch(CONFIG.SHEETS_ENDPOINT, { method:'POST', body: JSON.stringify({ action, ...payload, ts: new Date().toISOString() }), mode:'no-cors' }).catch(()=>{});
  }
}
function submitAppointment(){
  const payload = {
    name: byId('apptName').value.trim(),
    phone: byId('apptPhone').value.trim(),
    date: byId('apptDate').value,
    doctor: byId('apptType').value,
    note: byId('apptNote').value.trim(),
    trap: byId('apptTrap').value.trim()
  };
  const status = byId('apptStatus');
  if (payload.trap) { status.textContent = 'Submitted.'; return; }
  if (!payload.name || !validPhone(payload.phone) || !payload.date || !payload.doctor){ status.textContent = 'Fill name, 10-digit phone, date, and doctor.'; return; }
  status.textContent = 'Sending...';
  sendToSheets('appointment', payload);
  status.textContent = 'Appointment saved and routed.';
  byId('apptName').value = byId('apptPhone').value = byId('apptNote').value = '';
  byId('apptType').value = '';
}
function unlockHealth(){
  const name = byId('hcName').value.trim();
  const phone = byId('hcPhone').value.trim();
  if (!name || !validPhone(phone)) return;
  healthUnlocked = true;
  localStorage.setItem(LS.health, JSON.stringify({ name, phone }));
  byId('healthSpace').classList.remove('locked');
  byId('healthSpace').classList.add('unlocked');
  byId('healthModal').classList.remove('open');
  appendBubble(byId('healthLog'),'assistant',`Welcome, ${name}. Ask your health question.`);
  sendToSheets('health_gate', { name, phone });
}
function placeOrder(){
  const payload = {
    name: byId('orderName').value.trim(),
    phone: byId('orderPhone').value.trim(),
    address: byId('orderAddress').value.trim(),
    payMode: byId('paymentMode').value,
    trap: byId('orderTrap').value.trim(),
    cart,
    total: cart.reduce((s, row) => s + ((ITEMS.find(i => i.id === row.id)?.price || 0) * row.qty), 0)
  };
  const status = byId('orderStatus');
  if (payload.trap) { status.textContent = 'Saved.'; return; }
  if (!payload.name || !validPhone(payload.phone) || !payload.address || !payload.payMode || !payload.cart.length) { status.textContent = 'Add items and complete name, phone, address, payment mode.'; return; }
  status.textContent = 'Sending order...';
  sendToSheets('order', payload);
  status.textContent = `Order saved. Amount fixed at ${CONFIG.CURRENCY}${payload.total}.`;
}
function submitFeedback(){
  const payload = { name: byId('fbName').value.trim(), text: byId('fbText').value.trim() };
  if (!payload.name || !payload.text) return;
  const arr = loadJSON(LS.feedback, DEFAULT_FEEDBACK);
  arr.unshift(payload); saveJSON(LS.feedback, arr.slice(0, 20)); renderFeedback();
  sendToSheets('feedback', payload);
  byId('fbName').value=''; byId('fbText').value='';
}
function submitAgentFeedback(){
  const payload = { rating: agentRating || 0, text: byId('agentFeedbackText').value.trim() };
  if (!payload.rating || !payload.text) { byId('agentFeedbackStatus').textContent = 'Select a rating and add a note.'; return; }
  sendToSheets('agent_feedback', payload);
  byId('agentFeedbackStatus').textContent = 'Agent feedback saved.';
  byId('agentFeedbackText').value='';
}
function submitComplaint(){
  const text = byId('complaintText').value.trim();
  if (!text) return;
  sendToSheets('complaint', { text });
  byId('complaintStatus').textContent = 'Complaint sent.';
  byId('complaintText').value='';
}
function updatePayLink(){
  const amount = cart.reduce((s, row) => s + ((ITEMS.find(i => i.id === row.id)?.price || 0) * row.qty), 0);
  const upi = CONFIG.DOCTOR_PHONE ? CONFIG.DOCTOR_PHONE : 'pay';
  byId('payLink').href = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(CONFIG.CLINIC_NAME || 'Clinic')}&am=${amount}&cu=INR`;
}
function bindEvents(){
  byId('drawerBtn').onclick = () => { byId('drawer').classList.add('open'); byId('overlay').classList.add('open'); };
  byId('overlay').onclick = closeDrawer;
  $$('[data-nav]').forEach(a => a.onclick = closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  $('#langSwitch').addEventListener('click', e => { const btn = e.target.closest('button'); if (btn) setLang(btn.dataset.lang); });
  $('#themeSwitch').addEventListener('click', e => { const btn = e.target.closest('button'); if (btn) setTheme(btn.dataset.theme); });
  byId('sendChat').onclick = sendChat;
  byId('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  byId('sendHealth').onclick = sendHealth;
  byId('healthInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendHealth(); });
  byId('apptSubmit').onclick = submitAppointment;
  byId('hcEnter').onclick = unlockHealth;
  byId('closeHealthModal').onclick = unlockHealth;
  byId('placeOrder').onclick = placeOrder;
  byId('sendFeedback').onclick = submitFeedback;
  byId('sendAgentFeedback').onclick = submitAgentFeedback;
  byId('sendComplaint').onclick = submitComplaint;
  byId('aiOpen').onclick = () => openSection('assistant');
  $$('[data-open-ai]').forEach(btn => btn.onclick = () => {
    const target = btn.dataset.openAi;
    openSection(target === 'appointment' ? 'appointment' : 'assistant');
    byId('chatInput').value = target;
    sendChat();
  });
  $$('[data-rate]').forEach(btn => btn.onclick = () => {
    agentRating = Number(btn.dataset.rate);
    localStorage.setItem(LS.rating, String(agentRating));
    $$('#ratingRow button').forEach(b => b.classList.toggle('active', Number(b.dataset.rate) <= agentRating));
  });
}
function closeDrawer(){ byId('drawer').classList.remove('open'); byId('overlay').classList.remove('open'); }
function loadSaved(){
  const theme = localStorage.getItem(LS.theme) || 'dark';
  setTheme(theme);
  updateTexts();
  renderCatalog();
  renderFeedback();
  seedQuickReplies();
  renderChat();
  renderHealth();
  syncDoctorInfo();
  updatePayLink();
  const savedHealth = loadJSON(LS.health, null);
  if (savedHealth){ healthUnlocked = true; byId('healthSpace').classList.remove('locked'); byId('healthSpace').classList.add('unlocked'); }
  $$('#ratingRow button').forEach(b => b.classList.toggle('active', Number(b.dataset.rate) <= agentRating));
}

window.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  loadSaved();
  addLog('page_load', { lang, theme: document.documentElement.dataset.theme || 'dark' });
});
