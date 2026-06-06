/* ===========================
   CUSTOM CURSOR
=========================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interactions
document.querySelectorAll('a, button, .service-card, .skill-tags span, .setup-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursor.style.background = 'transparent';
    cursor.style.border = '2px solid #C8A97E';
    follower.style.width = '48px';
    follower.style.height = '48px';
    follower.style.borderColor = 'rgba(200,169,126,0.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '8px';
    cursor.style.height = '8px';
    cursor.style.background = '#C8A97E';
    cursor.style.border = 'none';
    follower.style.width = '32px';
    follower.style.height = '32px';
    follower.style.borderColor = '#C8A97E';
  });
});

/* ===========================
   NAV SCROLL
=========================== */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ===========================
   SCROLL REVEAL
=========================== */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

/* ===========================
   HERO LOAD ANIMATION
=========================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-card').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);
});

/* ===========================
   SMOOTH ACTIVE NAV
=========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#C8A97E';
    }
  });
});

/* ===========================
   SKILL TAGS STAGGER
=========================== */
document.querySelectorAll('.skill-group').forEach(group => {
  const tags = group.querySelectorAll('.skill-tags span');
  tags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 0.04}s`;
  });
});

/* ===========================
   CARD TILT EFFECT (Profile)
=========================== */
const profileCard = document.querySelector('.card-inner');
if (profileCard) {
  profileCard.addEventListener('mousemove', (e) => {
    const rect = profileCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    profileCard.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  profileCard.addEventListener('mouseleave', () => {
    profileCard.style.transform = '';
  });
}

/* ===========================
   TYPING EFFECT (optional subtle)
=========================== */
const typingTarget = document.querySelector('.hero-eyebrow');
if (typingTarget) {
  const text = typingTarget.textContent;
  typingTarget.textContent = '';
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      typingTarget.textContent += text[i];
      i++;
      setTimeout(typeChar, 50);
    }
  }

  setTimeout(typeChar, 600);
}

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el, target) {
  let current = 0;
  const increment = Math.ceil(target / 40);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + current + suffix;
  }, 40);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEls = entry.target.querySelectorAll('.card-stats strong');
      statEls.forEach(el => {
        const raw = el.textContent.trim();
        const val = parseInt(raw);
        if (!isNaN(val)) {
          // Extract suffix (e.g. "+" or "hr") and prefix if any
          const suffix = raw.replace(/^[^0-9]*[0-9]+/, ''); // everything after number
          const prefix = raw.replace(/[0-9].*$/, '');       // everything before number
          el.dataset.suffix = suffix;
          el.dataset.prefix = prefix;
          animateCounter(el, val);
          el.textContent = prefix + '0' + suffix;
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const cardStats = document.querySelector('.card-stats');
if (cardStats) statsObserver.observe(cardStats);

/* ===========================
   PARALLAX (subtle blobs)
=========================== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  if (blob1) blob1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (blob2) blob2.style.transform = `translateY(${scrollY * -0.1}px)`;
});

/* ===========================
   CONTACT BTN RIPPLE
=========================== */
document.querySelectorAll('.contact-btn, .btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.15);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('%c👋 Hey there!', 'color:#C8A97E; font-size:20px; font-weight:bold;');
console.log('%cThis portfolio was built with care for John Michael Sevilla — General VA & Article Writer from the Philippines.', 'color:#888; font-size:13px;');
