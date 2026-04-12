(() => {
  'use strict';

  const root = document.documentElement;
  const nav = document.getElementById('nav');

  // -- Theme ----------------------------------------------------------
  const THEME_KEY = 'theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const stored = localStorage.getItem(THEME_KEY);
  root.dataset.theme = stored || (prefersDark.matches ? 'dark' : 'light');

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      root.dataset.theme = e.matches ? 'dark' : 'light';
    }
  });

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
    });
  });

  // -- Mobile nav -----------------------------------------------------
  const navToggle = nav.querySelector('.nav__toggle');
  const navMenu = nav.querySelector('.nav__menu');

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // -- Shadow line on scroll -----------------------------------------
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // -- Scroll-spy -----------------------------------------------------
  const links = Array.from(navMenu.querySelectorAll('a[href^="#"]'));
  const linkById = new Map(
    links.map((a) => [a.getAttribute('href').slice(1), a])
  );
  const clearCurrent = () => links.forEach((a) => a.removeAttribute('aria-current'));

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearCurrent();
          const link = linkById.get(entry.target.id);
          if (link) link.setAttribute('aria-current', 'page');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  document.querySelectorAll('section[id]').forEach((s) => spyObserver.observe(s));

  // -- Reveal on scroll ----------------------------------------------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = document.querySelectorAll('[data-animate]');
  if (reduceMotion) {
    reveal.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveal.forEach((el) => revealObserver.observe(el));
  }

  // -- Footer year ---------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
