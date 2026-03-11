// ── FALLING ASH/FEATHER PARTICLES ─────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

function randomRange(min, max) { return Math.random() * (max - min) + min; }

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = randomRange(0, W);
    this.y = initial ? randomRange(-H, H) : randomRange(-50, -10);
    this.size = randomRange(1, 3.5);
    this.speedY = randomRange(0.3, 1.1);
    this.speedX = randomRange(-0.3, 0.3);
    this.rotation = randomRange(0, Math.PI * 2);
    this.rotSpeed = randomRange(-0.01, 0.01);
    this.alpha = randomRange(0.04, 0.18);
    this.type = Math.random() > 0.5 ? 'ash' : 'petal';
    this.wobble = randomRange(0, Math.PI * 2);
    this.wobbleSpeed = randomRange(0.005, 0.02);
    this.wobbleAmp = randomRange(0.3, 1.5);
    this.color = Math.random() > 0.7
      ? `rgba(220, 20, 60, ${this.alpha})`
      : `rgba(255, 255, 255, ${this.alpha})`;
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmp;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y > H + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    if (this.type === 'ash') {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 2);
      ctx.bezierCurveTo(this.size * 1.5, -this.size, this.size * 1.5, this.size, 0, this.size * 2);
      ctx.bezierCurveTo(-this.size * 1.5, this.size, -this.size * 1.5, -this.size, 0, -this.size * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

const particles = Array.from({ length: 70 }, () => new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── NAV SCROLL EFFECT ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  setActiveNavLink();
});

// ── HAMBURGER / MOBILE MENU ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobileMenu() { mobileMenu.classList.remove('open'); }
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target))
    mobileMenu.classList.remove('open');
});

// ── ACTIVE NAV LINK ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function setActiveNavLink() {
  let current = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top < 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
}

// ── HERO ENTRANCE ANIMATION ─────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroPhoto   = document.querySelector('.hero-photo-wrap');
  if (heroContent) {
    heroContent.style.cssText = 'opacity:0;transform:translateX(-30px);transition:opacity 1s ease,transform 1s ease';
    setTimeout(() => { heroContent.style.opacity = '1'; heroContent.style.transform = 'translateX(0)'; }, 150);
  }
  if (heroPhoto) {
    heroPhoto.style.cssText = 'opacity:0;transform:translateX(30px) scale(0.96);transition:opacity 1s ease,transform 1s ease';
    setTimeout(() => { heroPhoto.style.opacity = '1'; heroPhoto.style.transform = 'translateX(0) scale(1)'; }, 350);
  }
});

// ── TYPING EFFECT FOR HERO SUBTITLE ────────────────────────
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.borderRight = '1px solid var(--crimson)';
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      subtitle.textContent += text[i++];
    } else {
      clearInterval(typeInterval);
      setTimeout(() => { subtitle.style.borderRight = 'none'; }, 800);
    }
  }, 38);
}

// ── SKILL FILTER ────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.skill-filter');
const skillCards = document.querySelectorAll('.skill-icon-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    skillCards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s, box-shadow 0.3s, transform 0.3s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 30);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── SCROLL REVEAL ANIMATIONS ────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.dn-reveal').forEach(el => revealObserver.observe(el));

// ── FADE-IN CARDS ───────────────────────────────────────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.classList.contains('tl-card')
          ? 'translateX(0)' : 'translateY(0)';
      }, i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.skill-icon-card, .case-card, .dn-stat, .dn-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s';
  cardObserver.observe(el);
});

// ── STAT COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(timer);
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.dn-num').forEach(num => {
        const val = parseFloat(num.textContent);
        if (!isNaN(val) && val > 1) {
          const hasSuffix = num.textContent.includes('+');
          animateCounter(num, val, hasSuffix ? '+' : '');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => statsObserver.observe(el));

// ── CURSOR BLOOD-TRAIL EFFECT ───────────────────────────────
const trail = [];
document.addEventListener('mousemove', (e) => {
  const drop = document.createElement('div');
  drop.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:4px; height:4px; border-radius:50%;
    background:rgba(220,20,60,0.4);
    pointer-events:none; z-index:9999;
    transition:opacity 0.6s ease, transform 0.6s ease;
  `;
  document.body.appendChild(drop);
  trail.push(drop);
  if (trail.length > 12) {
    const old = trail.shift();
    old.remove();
  }
  requestAnimationFrame(() => {
    drop.style.opacity = '0';
    drop.style.transform = 'scale(0)';
  });
  setTimeout(() => drop.remove(), 600);
});
