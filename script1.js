/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-to-top');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
  if (window.scrollY > 400) { backTop.classList.add('visible'); } else { backTop.classList.remove('visible'); }

  // Active nav
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===========================
   HAMBURGER
=========================== */
const ham = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
ham.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ===========================
   TYPING ANIMATION
=========================== */
const roles = ['Virtual Assistant', 'Full Stack Developer', 'AI Tools Enthusiast', 'Remote Worker', 'Cum Laude Graduate'];
let ri = 0, ci = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const current = roles[ri];
  if (!deleting) {
    typingEl.textContent = current.substring(0, ci + 1);
    ci++;
    if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typingEl.textContent = current.substring(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===========================
   SKILL BARS
=========================== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fills = e.target.querySelectorAll('.prof-fill');
      const pcts = e.target.querySelectorAll('.prof-pct');
      fills.forEach((fill, i) => {
        const w = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = w + '%';
          animatePct(pcts[i], parseInt(w));
        }, i * 100);
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const profSection = document.querySelector('.proficiency-section');
if (profSection) barObserver.observe(profSection);

function animatePct(el, target) {
  let n = 0;
  const step = () => {
    n = Math.min(n + 2, target);
    el.textContent = n + '%';
    if (n < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ===========================
   COUNTERS
=========================== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const counters = e.target.querySelectorAll('.counter');
      counters.forEach(c => {
        const target = parseInt(c.dataset.target);
        let n = 0;
        const step = () => {
          n = Math.min(n + Math.ceil(target / 50), target);
          c.textContent = n;
          if (n < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ===========================
   PROJECT FILTERS
=========================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.style.opacity = '1'; card.style.transform = '';
      } else {
        card.style.opacity = '0.2'; card.style.transform = 'scale(0.97)';
      }
    });
  });
});

/* ===========================
   CONTACT FORM
=========================== */
document.getElementById('btn-send').addEventListener('click', () => {
  let valid = true;
  const name = document.getElementById('cf-name');
  const email = document.getElementById('cf-email');
  const subject = document.getElementById('cf-subject');
  const message = document.getElementById('cf-message');

  const setErr = (id, show) => {
    document.getElementById(id).classList.toggle('visible', show);
  };

  if (!name.value.trim()) { setErr('err-name', true); valid = false; } else { setErr('err-name', false); }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.value.trim())) { setErr('err-email', true); valid = false; } else { setErr('err-email', false); }
  if (!subject.value.trim()) { setErr('err-subject', true); valid = false; } else { setErr('err-subject', false); }
  if (!message.value.trim()) { setErr('err-message', true); valid = false; } else { setErr('err-message', false); }

  if (valid) {
    document.getElementById('btn-send').style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }
});

/* ===========================
   SMOOTH SCROLL FOR ANCHORS
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
