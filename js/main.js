(() => {
  'use strict';

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) {}
    },
  };
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  };
  applyTheme(storage.get('theme') || 'light');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    storage.set('theme', next);
    applyTheme(next);
  });

  /* ---------- Mobile nav ---------- */
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');
  const closeNav = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.addEventListener('click', closeNav);

  /* ---------- Resume dropdown ---------- */
  const resumeBtn = document.getElementById('resume-toggle');
  const resumeMenu = document.getElementById('resume-menu');
  const closeResume = () => {
    resumeMenu.hidden = true;
    resumeBtn.setAttribute('aria-expanded', 'false');
  };
  resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resumeMenu.hidden = !resumeMenu.hidden;
    resumeBtn.setAttribute('aria-expanded', String(!resumeMenu.hidden));
  });

  /* Close overlays on outside click */
  document.addEventListener('click', () => {
    closeResume();
    closeNav();
  });

  /* ---------- Collapsible details — experience rows and project cards.
       Both collapse on narrow screens only; CSS decides at which width. ---------- */
  const setupAccordion = (root, btnSelector, detailSelector, startOpen) => {
    const btn = root.querySelector(btnSelector);
    const detail = root.querySelector(detailSelector);
    if (!btn || !detail) return;
    let open = startOpen;
    const render = () => {
      detail.classList.toggle('collapsed', !open);
      btn.querySelector('[data-toggle-icon]').textContent = open ? '–' : '+';
      btn.querySelector('[data-toggle-label]').textContent = open ? 'Hide details' : 'View details';
    };
    render();
    btn.addEventListener('click', () => { open = !open; render(); });
  };

  document.querySelectorAll('.exp-row').forEach((row, i) =>
    setupAccordion(row, '.job-toggle', '.job-detail', i === 0));
  document.querySelectorAll('.proj-card').forEach((card) =>
    setupAccordion(card, '.proj-toggle', '.proj-detail', false));

  /* ---------- Carousels (projects + testimonials) ---------- */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = carousel.querySelectorAll('[data-slide]');
    const dots = document.querySelectorAll(`[data-dots="${carousel.dataset.carousel}"] button`);
    let idx = 0;
    const render = () => {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => {
        d.style.background = i === idx ? 'var(--chartreuse)' : 'var(--stone-300)';
      });
    };
    const step = (delta) => { idx = (idx + delta + slides.length) % slides.length; render(); };

    carousel.querySelectorAll('[data-prev]').forEach((b) =>
      b.addEventListener('click', () => step(-1)));
    carousel.querySelectorAll('[data-next]').forEach((b) =>
      b.addEventListener('click', () => step(1)));
    dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; render(); }));

    /* Touch swipe. Only acts when the gesture is clearly horizontal, so
       vertical page scrolling over a carousel is never hijacked. */
    let startX = 0, startY = 0, tracking = false;
    carousel.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
      step(dx < 0 ? 1 : -1);
    }, { passive: true });

    render();
  });

  /* ---------- Lucide icons ---------- */
  const renderIcons = () => {
    if (window.lucide) window.lucide.createIcons();
    else setTimeout(renderIcons, 200);
  };
  renderIcons();
})();
