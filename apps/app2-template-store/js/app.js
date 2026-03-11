/* ============================================
   TEMPLATEHUB — Marketplace JS
   Features: Product catalog, filtering, modal,
             Gumroad checkout, newsletter capture
   ============================================ */
'use strict';

// ---- PRODUCT CATALOG ----
const PRODUCTS = [
  {
    id: 'notion-os', category: 'notion', tag: 'hot',
    emoji: '🗂️', bg: 'linear-gradient(135deg,#6C47FF22,#6C47FF44)',
    title: 'Ultimate Life OS — Notion',
    desc: 'The complete operating system for your life. Manage projects, habits, goals, finances, and more in one beautiful Notion workspace.',
    price: 29, original: 49,
    rating: 4.9, sales: 2840,
    gumroadId: 'notion-life-os', // replace with real Gumroad product ID
    includes: ['40+ linked databases','Daily/Weekly/Monthly reviews','Finance tracker','Project management hub','Reading list & book notes','Habit tracker with streaks','Travel planner','10 bonus templates'],
  },
  {
    id: 'figma-ui', category: 'figma', tag: 'new',
    emoji: '🎨', bg: 'linear-gradient(135deg,#FF6B3522,#FF6B3544)',
    title: 'SaaS UI Kit — Figma',
    desc: '600+ production-ready UI components for building modern SaaS products. Dark & light modes, auto-layout, and design tokens included.',
    price: 49, original: 89,
    rating: 4.8, sales: 1640,
    gumroadId: 'figma-saas-ui',
    includes: ['600+ UI components','Dark & light themes','Auto-layout ready','Design tokens','10 page templates','Icon library (500+)','Responsive grids','Free lifetime updates'],
  },
  {
    id: 'canva-brand', category: 'canva', tag: null,
    emoji: '✨', bg: 'linear-gradient(135deg,#00C89622,#00C89644)',
    title: 'Brand Identity Kit — Canva',
    desc: 'Everything you need to launch a professional brand. Logo templates, color palettes, typography guides, business cards, and social media kits.',
    price: 19, original: null,
    rating: 5.0, sales: 980,
    gumroadId: 'canva-brand-kit',
    includes: ['15 logo variations','Business card templates','Social media kit (50+ posts)','Brand guidelines PDF','Color palette system','Typography pairings','Email signature','Pitch deck template'],
  },
  {
    id: 'startup-bundle', category: 'bundle', tag: 'sale',
    emoji: '🚀', bg: 'linear-gradient(135deg,#FFB80022,#FFB80044)',
    title: 'Startup Founder Bundle',
    desc: 'The complete toolkit for startup founders. Notion workspace, investor deck template, financial model, product roadmap, and more.',
    price: 79, original: 297,
    rating: 4.9, sales: 740,
    gumroadId: 'startup-bundle',
    includes: ['Notion founder workspace','Investor pitch deck (Figma)','Financial model (Notion)','Product roadmap template','User research database','OKR tracker','Hiring pipeline','Marketing calendar','Press kit template','Competitor analysis template','Customer interview tracker','12 bonus templates'],
  },
  {
    id: 'notion-crm', category: 'notion', tag: null,
    emoji: '📊', bg: 'linear-gradient(135deg,#6C47FF22,#00C89633)',
    title: 'CRM & Sales Pipeline — Notion',
    desc: 'A powerful CRM built entirely in Notion. Track leads, manage deals, log calls, and close more sales without paying for expensive CRM software.',
    price: 24, original: null,
    rating: 4.7, sales: 1120,
    gumroadId: 'notion-crm',
    includes: ['Lead tracking database','Sales pipeline board','Email templates library','Meeting notes template','Contact enrichment system','Revenue forecasting','Team performance tracker','Integration guides'],
  },
  {
    id: 'framer-portfolio', category: 'framer', tag: 'new',
    emoji: '🌐', bg: 'linear-gradient(135deg,#FF6B3522,#6C47FF33)',
    title: 'Designer Portfolio — Framer',
    desc: 'A stunning, animated portfolio website built in Framer. One-click clone, fully customizable, zero code required. Makes a lasting first impression.',
    price: 39, original: null,
    rating: 4.9, sales: 430,
    gumroadId: 'framer-portfolio',
    includes: ['5 page layouts','Smooth scroll animations','Project case study template','Contact form','Dark/light mode','Mobile optimized','SEO ready','Video background support'],
  },
  {
    id: 'social-pack', category: 'canva', tag: null,
    emoji: '📱', bg: 'linear-gradient(135deg,#FF6B3522,#FFB80033)',
    title: '365-Day Social Media Pack — Canva',
    desc: 'A full year of social media content templates for Instagram, LinkedIn, Twitter, and Facebook. Batch-create your entire content calendar in a weekend.',
    price: 34, original: 59,
    rating: 4.8, sales: 2100,
    gumroadId: 'social-365',
    includes: ['365 post templates','Instagram feed layouts','Stories & Reels covers','LinkedIn carousels','Twitter/X post templates','Pinterest pins','YouTube thumbnails','Content calendar planner'],
  },
  {
    id: 'notion-finance', category: 'notion', tag: null,
    emoji: '💰', bg: 'linear-gradient(135deg,#00C89622,#FFB80033)',
    title: 'Personal Finance Dashboard — Notion',
    desc: 'Take complete control of your finances. Track income, expenses, investments, savings goals, and net worth — all in a beautiful Notion dashboard.',
    price: 18, original: null,
    rating: 4.9, sales: 1850,
    gumroadId: 'notion-finance',
    includes: ['Monthly budget tracker','Expense categorization','Investment portfolio tracker','Net worth calculator','Savings goals dashboard','Bill payment reminders','Tax preparation checklist','Financial goals timeline'],
  },
];

const FREE_PRODUCTS = [
  {
    id: 'free-notion-weekly', category: 'notion', tag: 'free',
    emoji: '📅', bg: 'linear-gradient(135deg,#6C47FF15,#6C47FF25)',
    title: 'Weekly Planner — Notion (Free)',
    desc: 'A beautifully designed weekly planner for Notion. Plan your week, track habits, and review your progress.',
    price: 0, original: null, rating: 4.8, sales: 5200,
    gumroadId: 'free-weekly-planner',
    includes: ['7-day planning view','Habit tracker','Daily priorities','Weekly review template'],
  },
  {
    id: 'free-canva-resume', category: 'canva', tag: 'free',
    emoji: '📄', bg: 'linear-gradient(135deg,#FF6B3515,#FF6B3525)',
    title: 'ATS Resume Template — Canva (Free)',
    desc: 'A clean, ATS-optimized resume template that gets you past the bots and in front of hiring managers.',
    price: 0, original: null, rating: 4.9, sales: 8900,
    gumroadId: 'free-resume-canva',
    includes: ['ATS-optimized layout','Cover letter template','LinkedIn banner','Reference page'],
  },
  {
    id: 'free-figma-icons', category: 'figma', tag: 'free',
    emoji: '🎯', bg: 'linear-gradient(135deg,#00C89615,#00C89625)',
    title: '100 UI Icons Pack — Figma (Free)',
    desc: 'A clean icon set of 100 essential UI icons in Figma. Pixel-perfect, fully customizable stroke-based icons.',
    price: 0, original: null, rating: 4.7, sales: 3400,
    gumroadId: 'free-icon-pack',
    includes: ['100 stroke icons','Figma components','4 size variants','MIT license'],
  },
  {
    id: 'free-notion-goals', category: 'notion', tag: 'free',
    emoji: '🎯', bg: 'linear-gradient(135deg,#FFB80015,#FFB80025)',
    title: 'Goal Setting System — Notion (Free)',
    desc: 'A structured goal-setting template using the OKR and SMART framework, built in Notion.',
    price: 0, original: null, rating: 4.8, sales: 4100,
    gumroadId: 'free-goal-system',
    includes: ['Annual goals overview','Quarterly OKR tracker','Weekly check-ins','Milestone tracker'],
  },
];

const NEW_PRODUCTS = PRODUCTS.filter(p => p.tag === 'new').concat(
  PRODUCTS.filter(p => p.tag === 'hot').slice(0,2)
);

// ---- RENDER ----
function renderProduct(p) {
  const badgeMap = { hot:'badge-hot', new:'badge-new', free:'badge-free', sale:'badge-sale' };
  const badgeLabel = { hot:'🔥 Hot', new:'✨ New', free:'🆓 Free', sale:'🔥 Sale' };
  return `
    <div class="product-card" onclick="openProduct('${p.id}')">
      <div class="product-thumb" style="background:${p.bg}">
        <span>${p.emoji}</span>
        ${p.tag ? `<span class="product-badge ${badgeMap[p.tag]}">${badgeLabel[p.tag]}</span>` : ''}
        <div class="overlay"><button class="btn-quick-buy" onclick="event.stopPropagation();buyNow('${p.id}')">Buy Now</button></div>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.category.toUpperCase()}</div>
        <div class="product-title">${p.title}</div>
        <div class="product-desc">${p.desc.substring(0,90)}...</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.price === 0 ? '<span style="color:var(--accent);font-weight:900">FREE</span>' : `$${p.price}`}
            ${p.original ? `<span class="original">$${p.original}</span>` : ''}
          </div>
          <div class="product-meta">
            <span class="product-rating"><span class="star">★</span> ${p.rating}</span>
            <span class="product-sales">${p.sales.toLocaleString()} sales</span>
          </div>
        </div>
      </div>
    </div>`;
}

function renderGrid(products, gridId) {
  const el = document.getElementById(gridId);
  if (el) el.innerHTML = products.map(renderProduct).join('');
}

// ---- PRODUCT MODAL ----
function openProduct(id) {
  const p = [...PRODUCTS, ...FREE_PRODUCTS].find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="modal-header">
      <div></div>
      <button class="modal-close" onclick="closeProductModal()">✕</button>
    </div>
    <div class="modal-thumb-large" style="background:${p.bg}">${p.emoji}</div>
    <div class="modal-body">
      <div class="modal-cat">${p.category.toUpperCase()}</div>
      <h2 class="modal-title">${p.title}</h2>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <span style="color:#FFB800;font-size:0.9rem">★★★★★ ${p.rating}</span>
        <span style="font-size:0.85rem;color:var(--text-light)">${p.sales.toLocaleString()} happy customers</span>
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-includes">
        <h4>📦 What's included:</h4>
        <ul>${p.includes.map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="modal-pricing-row">
        <div>
          <span class="modal-price">${p.price === 0 ? 'FREE' : `$${p.price}`}</span>
          ${p.original ? `<span class="modal-original">$${p.original}</span>` : ''}
        </div>
        <div style="font-size:0.8rem;color:var(--text-light)">⚡ Instant download</div>
      </div>
      <button class="btn-buy-now" onclick="buyNow('${p.id}')">
        ${p.price === 0 ? '🆓 Download Free →' : `💳 Buy Now — $${p.price} →`}
      </button>
      <p class="modal-guarantee">🔒 Secure checkout · ⚡ Instant delivery · 30-day money-back guarantee</p>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.id === 'productModal') closeProductModal();
});

// ---- BUY NOW (Gumroad overlay) ----
function buyNow(id) {
  const p = [...PRODUCTS, ...FREE_PRODUCTS].find(x => x.id === id);
  if (!p) return;

  // In production: use Gumroad embed or Stripe checkout
  // Gumroad: window.open(`https://gumroad.com/l/${p.gumroadId}`, '_blank');
  // For demo — show simulated checkout
  simulateCheckout(p);
}

function simulateCheckout(p) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px`;
  overlay.innerHTML = `
    <div style="background:white;border-radius:20px;padding:40px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:12px">${p.emoji}</div>
      <h3 style="font-size:1.2rem;font-weight:800;margin-bottom:6px;color:#1A1A1A">${p.title}</h3>
      <div style="font-size:1.8rem;font-weight:900;color:#FF6B35;margin-bottom:20px">${p.price === 0 ? 'FREE' : `$${p.price}`}</div>
      ${p.price === 0 ? `
        <input type="email" placeholder="Your email for download link..." style="width:100%;padding:12px 16px;border:1px solid #E0DDD6;border-radius:10px;font-size:0.9rem;margin-bottom:14px;font-family:inherit"/>
        <button onclick="completeDownload(this.parentElement)" style="width:100%;background:#00C896;color:white;border:none;padding:14px;border-radius:10px;font-weight:700;font-size:0.95rem;cursor:pointer">🆓 Get Free Download →</button>
      ` : `
        <div style="background:#F3F2EE;border-radius:10px;padding:14px;margin-bottom:14px;font-size:0.85rem;color:#6B6B6B;text-align:left">
          💳 &nbsp;Checkout powered by <strong>Gumroad</strong> · Instant delivery
        </div>
        <button onclick="completeDownload(this.parentElement)" style="width:100%;background:#FF6B35;color:white;border:none;padding:14px;border-radius:10px;font-weight:700;font-size:0.95rem;cursor:pointer;box-shadow:0 8px 25px rgba(255,107,53,0.4)">💳 Complete Purchase — $${p.price} →</button>
      `}
      <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#9B9B9B;font-size:0.82rem;cursor:pointer;margin-top:12px">Cancel</button>
      <p style="font-size:0.75rem;color:#9B9B9B;margin-top:10px">🔒 Secured · ⚡ Instant delivery · 30-day guarantee</p>
    </div>`;
  document.body.appendChild(overlay);
}

function completeDownload(box) {
  box.innerHTML = `
    <div style="padding:20px">
      <div style="font-size:3rem;margin-bottom:12px">🎉</div>
      <h3 style="font-size:1.2rem;font-weight:800;margin-bottom:8px;color:#1A1A1A">You're all set!</h3>
      <p style="font-size:0.9rem;color:#6B6B6B;margin-bottom:20px">Your download link has been sent to your email. Check your inbox!</p>
      <button onclick="document.querySelector('[style*=z-index:9999]').remove()" style="background:#1A1A1A;color:white;border:none;padding:12px 28px;border-radius:10px;font-weight:700;cursor:pointer">Done ✓</button>
    </div>`;
}

// ---- CATEGORY FILTER ----
document.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const cat = this.textContent.trim().toLowerCase().split(' ')[0];
    if (cat === 'all') {
      renderGrid(PRODUCTS, 'products-grid');
    } else {
      const filtered = PRODUCTS.filter(p => p.category === cat || (cat === 'bundles' && p.category === 'bundle'));
      renderGrid(filtered.length ? filtered : PRODUCTS, 'products-grid');
    }
  });
});

// ---- NEWSLETTER ----
function subscribeNewsletter() {
  const email = document.getElementById('nl-email').value.trim();
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }
  const btn = document.querySelector('.btn-newsletter');
  btn.textContent = '✅ Subscribed!';
  btn.style.background = '#00C896';
  document.getElementById('nl-email').value = '';
  setTimeout(() => { btn.textContent = 'Subscribe →'; btn.style.background = ''; }, 3000);
}

// ---- NAV CATEGORY ACTIVE STATE ----
document.querySelectorAll('.nav-cat').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-cat').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// ---- SCROLL ANIMATION ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderGrid(PRODUCTS, 'products-grid');
  renderGrid(NEW_PRODUCTS.length >= 4 ? NEW_PRODUCTS : PRODUCTS.slice(0,4), 'new-grid');
  renderGrid(FREE_PRODUCTS, 'free-grid');

  // Observe cards after render
  setTimeout(() => {
    document.querySelectorAll('.product-card, .t-card, .earning-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(el);
    });
  }, 100);
});