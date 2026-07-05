/* KRYONIS — Civilization Discovery Engine */

/* Form endpoint — set this ONCE after deploying the Cloudflare Worker.
   Example: 'https://kryonis-forms.yourname.workers.dev'
   While empty, forms fall back to opening an email draft. */
const KRYONIS_FORM_ENDPOINT = '';

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
    const setExpanded = (open) => {
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      setExpanded(isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        setExpanded(false);
      });
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        setExpanded(false);
        navToggle.focus();
      }
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

  /* ===== Universal form handler: on-page forms -> Cloudflare Worker -> Studio ===== */
  const forms = document.querySelectorAll('form[data-kryonis-form]');
  forms.forEach((form) => {
    const statusEl = form.querySelector('.form-status');
    const btn = form.querySelector('button[type="submit"]');
    const setStatus = (msg, ok) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle('is-ok', !!ok);
      statusEl.classList.toggle('is-error', ok === false);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = { form: form.dataset.kryonisForm, page: location.pathname };
      let valid = true;
      form.querySelectorAll('input[name], select[name], textarea[name]').forEach((el) => {
        payload[el.name] = el.value.trim();
        if (el.required && !el.value.trim()) valid = false;
      });
      const sel = form.querySelector('select[name]');
      if (sel) payload[sel.name + '_label'] = sel.options[sel.selectedIndex]?.text || '';
      if (!valid || !payload.email || !payload.email.includes('@')) {
        setStatus('Please complete the required fields.', false);
        return;
      }

      /* Fallback: no endpoint configured -> email draft */
      if (!KRYONIS_FORM_ENDPOINT) {
        const subject = encodeURIComponent(`KRYONIS — ${payload.instrument || payload.track || 'Inquiry'} — ${payload.name}`);
        const body = encodeURIComponent(Object.entries(payload)
          .filter(([k]) => !['website', 'page', 'form'].includes(k))
          .map(([k, v]) => `${k}: ${v}`).join('\n'));
        window.location.href = `mailto:hq@kryonis.global?subject=${subject}&body=${body}`;
        return;
      }

      try {
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
        setStatus('', true);
        const res = await fetch(KRYONIS_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.ok) {
          form.reset();
          setStatus('Received. A written reply follows within seven days — for commissions, a scope within 48 hours.', true);
        } else {
          setStatus('The message could not be sent. Please write directly to hq@kryonis.global.', false);
        }
      } catch (err) {
        setStatus('The message could not be sent. Please write directly to hq@kryonis.global.', false);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || btn.textContent; }
      }
    });
  });

  /* Commission card buttons -> preselect instrument, scroll to form */
  document.querySelectorAll('.commission-open').forEach((a) => {
    a.addEventListener('click', () => {
      const sel = document.getElementById('cf-instrument');
      if (sel && a.dataset.instrument) {
        for (const opt of sel.options) {
          if (opt.value === a.dataset.instrument) { sel.value = opt.value; break; }
        }
      }
    });
  });

  /* Prefill instrument from URL ?instrument=C-01 */
  (() => {
    const p = new URLSearchParams(location.search).get('instrument');
    const sel = document.getElementById('cf-instrument');
    if (p && sel) {
      for (const opt of sel.options) {
        if (opt.value.startsWith(p)) { sel.value = opt.value; break; }
      }
    }
  })();

})();
