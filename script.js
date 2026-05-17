/* KRYONIS — Civilization Discovery Engine */
(() => {
  'use strict';

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* Registry filter */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const hypotheses = document.querySelectorAll('.hypothesis, .hyp-detail');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hypotheses.forEach(h => {
        h.style.display = (filter === 'all' || h.dataset.status === filter) ? '' : 'none';
      });
    });
  });

  /* Mobile nav */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* In-page active nav highlight */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const onScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current = '';
      sections.forEach(s => { if (scrollPos >= s.offsetTop) current = s.id; });
      navAnchors.forEach(a => {
        const href = a.getAttribute('href').replace('#', '');
        a.classList.toggle('active', href === current);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Footer year */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Correspondence form — open mailto with composed message */
  const corrForm = document.querySelector('#corr-form');
  if (corrForm) {
    corrForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = corrForm.querySelector('[name=name]').value.trim();
      const org = corrForm.querySelector('[name=org]').value.trim();
      const email = corrForm.querySelector('[name=email]').value.trim();
      const message = corrForm.querySelector('[name=message]').value.trim();
      const subject = encodeURIComponent('KRYONIS — Correspondence Inquiry');
      const body = encodeURIComponent(
        `Name: ${name}\nOrganisation: ${org}\nReply-to: ${email}\n\n${message}`
      );
      window.location.href = `mailto:office@kryonis.global?subject=${subject}&body=${body}`;
    });
  }
})();
