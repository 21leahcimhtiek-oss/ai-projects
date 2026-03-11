/* ============================================
   RESUMEAI PRO — App JS
   Stripe freemium, signup modal, ATS demo,
   scroll animations, countdown
   ============================================ */
'use strict';

const PLANS = {
  free:   { label: 'Free Plan — No credit card required', btn: '🚀 Create Free Account' },
  pro:    { label: 'Pro Plan — 7 days free, then $9/month', btn: '✨ Start Free Trial' },
  career: { label: 'Career Plan — 7 days free, then $29/month', btn: '🎯 Start Free Trial' }
};

let currentPlan = 'free';

function openModal(plan) {
  currentPlan = plan || 'free';
  const data = PLANS[currentPlan];
  document.getElementById('modal-plan-badge').textContent = data.label;
  document.getElementById('signup-btn').textContent = data.btn;
  document.getElementById('signupModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('signupModal').classList.remove('on');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.id === 'signupModal') closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('signup-btn');
  btn.textContent = '⏳ Creating account...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1600));
  document.querySelector('.modal-box').innerHTML = `
    <div style="text-align:center;padding:16px">
      <div style="font-size:3rem;margin-bottom:14px">🎉</div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Account Created!</h2>
      <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:22px">
        Check your email for your login link. Your free trial is now active.
      </p>
      <button onclick="closeModal()" style="background:var(--gradient);color:white;border:none;padding:12px 28px;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.92rem">
        Start Building My Resume →
      </button>
    </div>`;
}

function ctaSignup() {
  const email = document.getElementById('ctaEmail').value.trim();
  if (!email.includes('@')) {
    document.getElementById('ctaEmail').style.borderColor = '#EF4444';
    return;
  }
  openModal('pro');
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
  }, { threshold: 0.08 });

  document.querySelectorAll('.feat-card,.how-step,.price-card,.rev-card,.stat-n').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
});