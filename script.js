/* ===========================
   CUSTOM CURSOR
=========================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .service-card, .skill-tags span, .setup-item, .timeline-content, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.style.transform = 'translate(-50%, -50%) scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.style.transform = 'translate(-50%, -50%) scale(1)'; });
});

/* ===========================
   FLOATING DOTS GENERATOR
=========================== */
function createDots() {
  const container = document.querySelector('.hero-dots');
  if (!container) return;
  const colors = ['#FF6B35', '#0A9396', '#FFD166', '#EF476F', '#06D6A0'];
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    const size = Math.random() * 8 + 4;
    dot.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(dot);
  }
}
createDots();

/* ===========================
   MARQUEE
=========================== */
function buildMarquee() {
  const items = [
    { icon: '⚡', text: 'General VA' },
    { icon: '📒', text: 'Bookkeeping Support' },
    { icon: '🔍', text: 'Lead Generation' },
    { icon: '🤖', text: 'AI-Powered' },
    { icon: '🇵🇭', text: 'Philippines Based' },
    { icon: '🕐', text: 'Available Now' },
    { icon: '💻', text: 'IT Graduate' },
    { icon: '✅', text: 'Focused on Quality Work' },
    { icon: '📧', text: 'Email Management' },
    { icon: '🎯', text: 'Detail-Oriented' },
  ];

  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate for seamless loop
  [...items, ...items].forEach(item => {
    const el = document.createElement('div');
    el.className = 'marquee-item';
    el.innerHTML = `<span>${item.icon}</span>${item.text} <span>✦</span>`;
    track.appendChild(el);
  });
}
buildMarquee();

/* ===========================
   NAV SCROLL
=========================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===========================
   HAMBURGER
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  if (menuOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    s1.style.transform = s2.style.opacity = s3.style.transform = '';
    s2.style.opacity = '1';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===========================
   HERO LOAD
=========================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-card').forEach(el => el.classList.add('visible'));
  }, 200);
});

/* ===========================
   TYPING EFFECT
=========================== */
const typingTarget = document.querySelector('.hero-eyebrow');
if (typingTarget) {
  const text = typingTarget.textContent;
  typingTarget.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < text.length) { typingTarget.textContent += text[i++]; setTimeout(typeChar, 55); }
  }
  setTimeout(typeChar, 700);
}

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el, target) {
  let current = 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const increment = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = prefix + current + suffix;
    if (current >= target) clearInterval(timer);
  }, 35);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.card-stats strong').forEach(el => {
        const raw = el.textContent.trim();
        const val = parseInt(raw);
        if (!isNaN(val)) {
          el.dataset.suffix = raw.replace(/^[^0-9]*[0-9]+/, '');
          el.dataset.prefix = raw.replace(/[0-9].*$/, '');
          el.textContent = el.dataset.prefix + '0' + el.dataset.suffix;
          animateCounter(el, val);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const cardStats = document.querySelector('.card-stats');
if (cardStats) statsObserver.observe(cardStats);

/* ===========================
   CARD 3D TILT
=========================== */
const profileCard = document.querySelector('.card-inner');
if (profileCard) {
  profileCard.addEventListener('mousemove', (e) => {
    const rect = profileCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    profileCard.style.transform = `perspective(700px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translate(-4px, -4px)`;
  });
  profileCard.addEventListener('mouseleave', () => {
    profileCard.style.transform = '';
  });
}

/* ===========================
   ACTIVE NAV HIGHLIGHT
=========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--orange)' : '';
  });
});

/* ===========================
   SKILL TAGS WAVE HOVER
=========================== */
document.querySelectorAll('.skill-group').forEach(group => {
  group.querySelectorAll('.skill-tags span').forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 0.03}s`;
  });
});

/* ===========================
   MAGNETIC BUTTONS
=========================== */
document.querySelectorAll('.btn-primary, .nav-cta a').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ===========================
   TEXT SCRAMBLE ON HERO TITLE
=========================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#@$%&';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--orange);opacity:0.5">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* ===========================
   RIPPLE EFFECT
=========================== */
document.querySelectorAll('.btn-primary, .contact-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    Object.assign(ripple.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      left: (e.clientX - rect.left - size / 2) + 'px',
      top: (e.clientY - rect.top - size / 2) + 'px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '50%',
      transform: 'scale(0)',
      animation: 'rippleAnim 0.6s ease-out',
      pointerEvents: 'none'
    });
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);

/* ===========================
   STAGGER SERVICE CARDS
=========================== */
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      serviceCards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 120);
      });
      serviceObserver.disconnect();
    }
  });
}, { threshold: 0.1 });

const servicesGrid = document.querySelector('.services-grid');
if (servicesGrid) serviceObserver.observe(servicesGrid);

/* ===========================
   PARALLAX SHAPES
=========================== */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const s1 = document.querySelector('.shape-1');
  const s2 = document.querySelector('.shape-2');
  const s3 = document.querySelector('.shape-3');
  if (s1) s1.style.transform = `translateY(${y * 0.12}px)`;
  if (s2) s2.style.transform = `translateY(${y * -0.08}px)`;
  if (s3) s3.style.transform = `translateY(${y * 0.05}px)`;
});

console.log('%c👋 Hi there!', 'color:#FF6B35; font-size:22px; font-weight:900; font-family:Syne,sans-serif;');
console.log('%cPortfolio of John Michael Sevilla — General VA & Bookkeeping Support 🇵🇭', 'color:#8B7355; font-size:13px;');
