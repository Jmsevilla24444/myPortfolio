/* ═══════════════════════════════════════════════════════════
   JOHN MICHAEL SEVILLA — PORTFOLIO SCRIPT
   Features: Typewriter · Scroll Reveal · Lightbox Carousel
             Counter Anim · Active Nav · Mobile Menu
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. TYPEWRITER EFFECT
───────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Virtual Assistant',
    'Full Stack Developer',
    'AI Power User',
    'Canva Designer',
    'Tech Support Specialist',
    'Social Media Manager',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
    }

    let speed = isDeleting ? 55 : 90;

    if (!isDeleting && charIdx === current.length) {
      // Finished typing — pause then delete
      pauseTimer = setTimeout(() => {
        isDeleting = true;
        type();
      }, 1800);
      return;
    }

    if (isDeleting && charIdx === 0) {
      // Finished deleting — next phrase
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  // Start after hero entrance animation
  setTimeout(type, 900);
})();


/* ─────────────────────────────────────────
   2. NAVBAR — SCROLL & ACTIVE LINK
───────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nav__links a');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll shadow
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active link tracking
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => {
            a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    });
  });
})();


/* ─────────────────────────────────────────
   3. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings for grouped reveals
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 300);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────
   4. ANIMATED COUNTERS
───────────────────────────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat__num[data-count]');
  if (!statNums.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────
   5. PORTFOLIO LIGHTBOX CAROUSEL
───────────────────────────────────────── */
(function initLightbox() {
  // ── Portfolio data ──────────────────────────────────────────────
  // To use REAL images:
  //   1. Add your image files to an "images/" folder next to index.html
  //   2. Set the data-image attribute on each .pf-item, e.g.:
  //      data-image="images/design-1.jpg"
  //   The lightbox will automatically show the image when defined.
  //
  // Emoji icons map to design type for the placeholder views
  const iconMap = {
    'Social Media Post':   '📱',
    'Event Flyer':         '📋',
    'Presentation Slide':  '🖥️',
    'Instagram Story':     '📸',
    'Business Card':       '🪪',
    'Infographic':         '📊',
  };

  const pfItems = document.querySelectorAll('.pf-item');
  const lightbox = document.getElementById('lightbox');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');
  const lbStage  = document.getElementById('lbStage');
  const lbInfo   = document.getElementById('lbInfo');
  const lbDots   = document.getElementById('lbDots');
  const lbBackdrop = document.getElementById('lbBackdrop');

  if (!lightbox || !pfItems.length) return;

  // Build dataset from DOM
  const items = Array.from(pfItems).map((el) => ({
    index:    parseInt(el.dataset.index),
    label:    el.dataset.label    || 'Design',
    desc:     el.dataset.desc     || '',
    gradient: el.dataset.gradient || '#333',
    imageSrc: el.dataset.image    || '',
  }));

  let currentIdx = 0;
  let isAnimating = false;

  // Build dot buttons
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lb-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    lbDots.appendChild(dot);
  });

  function getDots() {
    return lbDots.querySelectorAll('.lb-dot');
  }

  // ── Render a lightbox slide ──────────────────────────────────────
  function renderSlide(idx, direction) {
    const item = items[idx];
    if (!item) return;

    // Remove old
    const existing = lbStage.querySelector('.lb-visual');
    if (existing) {
      existing.classList.add('exiting');
      setTimeout(() => existing.remove(), 300);
    }

    const visual = document.createElement('div');
    visual.className = 'lb-visual';

    if (item.imageSrc) {
      // Real image
      const img = document.createElement('img');
      img.src = item.imageSrc;
      img.alt = item.label;
      visual.appendChild(img);
    } else {
      // Placeholder design preview
      visual.innerHTML = `
        <div class="lb-visual-placeholder" style="background:${item.gradient}">
          <div class="lb-placeholder-icon">${iconMap[item.label] || '🎨'}</div>
          <div class="lb-placeholder-title">${item.label}</div>
          <div class="lb-placeholder-desc">${item.desc}</div>
        </div>`;
    }

    // Entrance animation
    visual.style.opacity = '0';
    visual.style.transform = `translateX(${direction > 0 ? '24px' : '-24px'})`;
    lbStage.appendChild(visual);

    requestAnimationFrame(() => {
      visual.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
      visual.style.opacity = '1';
      visual.style.transform = 'none';
    });

    // Update info & dots
    lbInfo.textContent = `${item.label}  ·  ${idx + 1} / ${items.length}`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === idx));

    currentIdx = idx;
    lbPrev.disabled = idx === 0;
    lbNext.disabled = idx === items.length - 1;
  }

  // ── Navigation ───────────────────────────────────────────────────
  function goTo(idx, direction = 1) {
    if (isAnimating || idx === currentIdx) return;
    isAnimating = true;
    renderSlide(idx, direction);
    setTimeout(() => { isAnimating = false; }, 350);
  }

  function prev() {
    if (currentIdx > 0) goTo(currentIdx - 1, -1);
  }

  function next() {
    if (currentIdx < items.length - 1) goTo(currentIdx + 1, 1);
  }

  // ── Open / Close ─────────────────────────────────────────────────
  function openLightbox(idx) {
    currentIdx = idx;
    renderSlide(idx, 1);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => lbClose.focus(), 100);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Fade out then clear stage
    setTimeout(() => {
      lbStage.innerHTML = '';
    }, 400);
  }

  // ── Event Listeners ──────────────────────────────────────────────
  pfItems.forEach((item) => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index));
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // ── Touch / Swipe Support ────────────────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   6. MARQUEE — Manual Drag Scroll
───────────────────────────────────────── */
(function initMarqueeDrag() {
  document.querySelectorAll('.marquee').forEach((marquee) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    marquee.addEventListener('mousedown', (e) => {
      isDown = true;
      marquee.style.cursor = 'grabbing';
      startX = e.pageX - marquee.offsetLeft;
      scrollLeft = marquee.scrollLeft;
      // Pause auto-scroll while dragging
      marquee.querySelector('.marquee__track').style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      isDown = false;
      marquee.style.cursor = '';
    });

    marquee.addEventListener('mouseup', () => {
      isDown = false;
      marquee.style.cursor = '';
    });

    marquee.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - marquee.offsetLeft;
      const walk = (x - startX) * 2;
      marquee.scrollLeft = scrollLeft - walk;
    });
  });
})();


/* ─────────────────────────────────────────
   7. SMOOTH SCROLL for anchor links
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
