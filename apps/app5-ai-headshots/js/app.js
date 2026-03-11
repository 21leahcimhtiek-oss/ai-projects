/* HeadshotAI — App JS */
'use strict';
const PLANS = {
  starter:      { label:'Starter Package — $19 one-time',       btn:'📸 Get 40 Headshots — $19' },
  professional: { label:'Professional Package — $39 one-time',  btn:'📸 Get 120 Headshots — $39' },
  unlimited:    { label:'Unlimited Plan — $29/month',            btn:'🚀 Start 7-Day Free Trial' },
};
let plan = 'professional';
function openModal(p) {
  plan = p || 'professional';
  const d = PLANS[plan] || PLANS.professional;
  document.getElementById('m-plan-label').textContent = d.label;
  document.getElementById('m-btn-text').textContent = d.btn;
  document.getElementById('checkoutModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('checkoutModal').classList.remove('on');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => { if (e.target.id === 'checkoutModal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
async function handleCheckout(e) {
  e.preventDefault();
  const btn = document.getElementById('m-btn-text');
  btn.textContent = '⏳ Processing...'; btn.disabled = true;
  await new Promise(r => setTimeout(r, 1800));
  document.querySelector('.modal-box').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3rem;margin-bottom:14px">🎉</div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Order Confirmed!</h2>
      <p style="font-size:0.88rem;color:var(--muted);margin-bottom:8px">Upload your selfies to get started. Your headshots will be ready in under 2 hours.</p>
      <div style="background:rgba(78,205,196,0.1);border:1px solid rgba(78,205,196,0.25);border-radius:10px;padding:12px;margin:16px 0;font-size:0.82rem;color:#4ECDC4">
        ⚡ Estimated delivery: <strong>~2 hours</strong>
      </div>
      <button onclick="closeModal()" style="background:var(--grad);color:white;border:none;padding:12px 28px;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.92rem">
        Upload My Photos →
      </button>
    </div>`;
}
function ctaStart() {
  const email = document.getElementById('ctaEmail').value.trim();
  if (!email.includes('@')) { document.getElementById('ctaEmail').style.borderColor='#EF4444'; return; }
  openModal('professional');
}
document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.ba-card,.f-card,.style-card,.p-card,.rv-card').forEach(el => {
    el.style.opacity='0'; el.style.transform='translateY(18px)';
    el.style.transition='opacity 0.45s ease, transform 0.45s ease';
    obs.observe(el);
  });
});