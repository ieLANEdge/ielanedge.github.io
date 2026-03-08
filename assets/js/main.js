// === ieLAN Edge — Main JS (Fixed) ===
// Wait for layout.js to inject nav/footer, then initialize everything

document.addEventListener('layout-ready', () => {

  // ── THEME (must run first, before paint) ──────────────────────────────────
  const savedTheme = localStorage.getItem('ielan-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ielan-theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  // ── CUSTOM CURSOR ─────────────────────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring) {
    let mx = 0, my = 0;   // mouse position
    let rx = 0, ry = 0;   // ring lagged position

    // Hide default system cursor on the whole page
    document.documentElement.style.cursor = 'none';

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      // Dot follows instantly
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
    });

    // Ring follows with smooth lag
    (function animRing() {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(animRing);
    })();

    // Hover scale effect
    document.querySelectorAll('a, button, [data-hover], input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        ring.classList.add('active');
        el.style.cursor = 'none';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        ring.classList.remove('active');
      });
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity   = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity   = '0.5';
    });
  }

  // ── LOADER ────────────────────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1000);
    });
    // Fallback: hide after 2.5s regardless
    setTimeout(() => loader && loader.classList.add('hidden'), 2500);
  }

  // ── MOBILE NAV / HAMBURGER ────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ── NAV SCROLL SHRINK ─────────────────────────────────────────────────────
  const nav = document.querySelector('nav');
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── SCROLL REVEAL ─────────────────────────────────────────────────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

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
      const duration = 1800;
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
      btn.textContent = '⚡ Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#00e5a0,#00b4ff)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled    = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  });

}); // end DOMContentLoaded
