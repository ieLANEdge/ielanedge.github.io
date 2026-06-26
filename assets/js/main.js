// === ieLAN Edge — Main JS ===
// Wait for layout.js to inject nav/footer, then initialize everything

document.addEventListener('layout-ready', () => {

  // ── THEME (must run first, before paint) ──────────────────────────────────
  const savedTheme = localStorage.getItem('ielan-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = savedTheme === 'dark' ? '&#9728;' : '&#9789;';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ielan-theme', next);
      themeToggle.innerHTML = next === 'dark' ? '&#9728;' : '&#9789;';
    });
  }

  // ── LOADER ────────────────────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 500);
    });
    // Fallback: hide after 1.6s regardless
    setTimeout(() => loader && loader.classList.add('hidden'), 1600);
  }

  // ── MOBILE NAV / HAMBURGER ────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── NAV SCROLL SHRINK ─────────────────────────────────────────────────────
  const nav = document.querySelector('nav');
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── SCROLL REVEAL (progressive enhancement, fail-safe) ──────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    document.documentElement.classList.add('js-reveal-active');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
    // Safety net: if anything is still hidden after 2.5s (e.g. zero-height
    // container, observer quirk), reveal it so content is never lost.
    setTimeout(() => {
      revealEls.forEach(el => el.classList.add('visible'));
    }, 2500);
  }

  // ── ACTIVE NAV LINK ───────────────────────────────────────────────────────
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(currentPage) || (currentPage === '' && href.includes('index.html'))) {
      a.classList.add('active');
    }
  });

  // ── COUNTER ANIMATION ─────────────────────────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const duration = 1500;
      const start    = performance.now();
      const isFloat  = target % 1 !== 0;
      (function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(update);
      })(start);
    });
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateCounters(); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.stats-row').forEach(el => counterObs.observe(el));

  // ── PWA INSTALL BANNER ────────────────────────────────────────────────────
  let deferredPrompt;
  const installBanner = document.getElementById('installBanner');
  const btnInstall    = document.getElementById('btnInstall');
  const btnDismiss    = document.getElementById('btnDismiss');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner && !localStorage.getItem('pwa-dismissed')) {
      setTimeout(() => installBanner.classList.add('show'), 4000);
    }
  });
  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') localStorage.setItem('pwa-installed', '1');
      deferredPrompt = null;
      installBanner.classList.remove('show');
    });
  }
  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      installBanner.classList.remove('show');
      localStorage.setItem('pwa-dismissed', '1');
    });
  }

  // ── SERVICE WORKER ────────────────────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const sel = a.getAttribute('href');
      if (sel === '#') return;
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── FORM SUBMISSION ───────────────────────────────────────────────────────
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled    = false;
          form.reset();
        }, 3000);
      }, 1200);
    });
  });

}); // end DOMContentLoaded
