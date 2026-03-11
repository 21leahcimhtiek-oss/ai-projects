/* ============================================
   LINKPRO — App JS
   Modal, username claim, scroll effects
   ============================================ */
'use strict';

const PLAN_TEXT = {
  free:     { label:'Free Plan — No credit card required',         btn:'✨ Create Free Account' },
  creator:  { label:'Creator Plan — 14 days free, then $7/month',  btn:'🚀 Start Free Trial' },
  pro:      { label:'Pro Plan — 14 days free, then $19/month',     btn:'🎯 Start Free Trial' },
  business: { label:'Business Plan — 14 days free, then $49/month',btn:'⚡ Start Free Trial' },
};

let activePlan = 'free';

function openModal(plan) {
  activePlan = plan || 'free';
  const d = PLAN_TEXT[activePlan] || PLAN_TEXT.free;
  document.getElementById('m-plan-text').textContent = d.label;
  document.getElementById('m-submit-btn').textContent = d.btn;
  const uv = document.getElementById('usernameInput');
  if (uv && uv.value) document.getElementById('m-username').value = uv.value;
  document.getElementById('signupModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('signupModal').classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => { if (e.target.id === 'signupModal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('m-submit-btn');
  btn.textContent = '⏳ Setting up your page...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1800));
  document.querySelector('.modal-card').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3.2rem;margin-bottom:14px">🎉</div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:10px;letter-spacing:-0.5px">Your page is live!</h2>
      <div style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:12px;margin-bottom:18px">
        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:2px">Your link:</div>
        <div style="font-size:1rem;font-weight:800;color:#34D399">linkpro.io/yourname</div>
      </div>
      <p style="font-size:0.88rem;color:var(--muted);margin-bottom:22px">Start adding links, customize your theme, and start earning — all from your dashboard.</p>
      <button onclick="closeModal()" style="background:var(--grad);color:white;border:none;padding:12px 28px;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.92rem;box-shadow:0 6px 20px rgba(167,139,250,0.35)">
        Open My Dashboard →
      </button>
    </div>`;
}

function checkUsername(el) {
  const val = el.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  el.value = val;
  const status = document.getElementById('username-status');
  if (val.length === 0) {
    status.innerHTML = '🆓 Free forever · <span>No credit card needed</span>';
  } else if (val.length < 3) {
    status.innerHTML = '⚠️ Username must be at least 3 characters';
    status.style.color = '#FBBF24';
  } else {
    status.innerHTML = `✅ <span>linkpro.io/${val}</span> is available!`;
    status.style.color = '#34D399';
  }
}

function claimUsername() {
  const val = document.getElementById('usernameInput').value.trim();
  if (val.length < 3) {
    document.getElementById('usernameInput').style.borderColor = '#EF4444';
    return;
  }
  openModal('free');
}

// ---- SCROLL ANIMATIONS ----
document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.bento-card,.theme-preview,.p-card,.soc-card,.phone').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    obs.observe(el);
  });
});