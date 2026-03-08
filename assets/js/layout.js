// Inject shared nav and footer
function getNavHTML(rootPath = '') {
  return `
<div id="loader" class="loader">
  <div class="loader-logo">ieLAN</div>
  <div class="loader-tag">EDGE · AMAL TO IMPACT</div>
  <div class="loader-bar"><div class="loader-bar-fill"></div></div>
</div>
<div id="cursor" class="cursor"></div>
<div id="cursorRing" class="cursor-ring"></div>
<nav>
  <a href="${rootPath}index.html" class="nav-logo">
    <div class="nav-logo-mark">ie</div>
    <div class="nav-logo-text">
      <span class="nav-logo-name">ieLAN Edge</span>
      <span class="nav-logo-tag">Amal to Impact</span>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="${rootPath}index.html">Home</a></li>
    <li><a href="${rootPath}pages/about.html">About</a></li>
    <li class="nav-dropdown">
      <a href="${rootPath}pages/services.html">Services ▾</a>
      <div class="nav-dropdown-menu">
        <a href="${rootPath}pages/services.html#tech">Technology Solutions</a>
        <a href="${rootPath}pages/services.html#digital">Digital Transformation</a>
        <a href="${rootPath}pages/services.html#ai">AI & Data</a>
        <a href="${rootPath}pages/services.html#cloud">Cloud & Infrastructure</a>
        <a href="${rootPath}pages/services.html#consulting">Business Consulting</a>
      </div>
    </li>
    <li><a href="${rootPath}pages/solutions.html">Solutions</a></li>
    <li><a href="${rootPath}pages/ventures.html">Ventures</a></li>
    <li><a href="${rootPath}pages/newsroom.html">Newsroom</a></li>
    <li><a href="${rootPath}pages/careers.html">Careers</a></li>
  </ul>
  <div class="nav-right">
    <button class="theme-toggle" id="themeToggle" title="Toggle theme">🌙</button>
    <button class="nav-hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <a href="${rootPath}pages/contact.html" class="btn-nav">Contact Us</a>
  </div>
</nav>
<div class="mobile-nav" id="mobileNav">
  <a href="${rootPath}index.html">Home</a>
  <a href="${rootPath}pages/about.html">About</a>
  <a href="${rootPath}pages/services.html">Services</a>
  <a href="${rootPath}pages/solutions.html">Solutions</a>
  <a href="${rootPath}pages/ventures.html">Ventures</a>
  <a href="${rootPath}pages/newsroom.html">Newsroom</a>
  <a href="${rootPath}pages/careers.html">Careers</a>
  <a href="${rootPath}pages/contact.html">Contact</a>
</div>`;
}

function getFooterHTML(rootPath = '') {
  return `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${rootPath}index.html" class="footer-logo-wrap">
          <div class="footer-logo-mark">ie</div>
          <span class="footer-logo-name">ieLAN Edge</span>
        </a>
        <p class="footer-desc">A cross-border technology and innovation company bridging India to the world. Turning Amal — hope — into measurable impact.</p>
        <div class="footer-socials">
          <a href="https://www.linkedin.com/company/ieLANedge/" class="social-btn" title="LinkedIn">in</a>
          <a href="https://x.com/ielanedge" class="social-btn" title="Twitter">𝕏</a>
          <a href="https://www.facebook.com/ielanedge" class="social-btn" title="Facebook">F</a>
          <a href="https://www.youtube.com/@ieLANEdge" class="social-btn" title="YouTube">▶</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-col-links">
          <li><a href="${rootPath}pages/about.html">About Us</a></li>
          <li><a href="${rootPath}pages/ventures.html">Ventures</a></li>
          <li><a href="${rootPath}pages/newsroom.html">Newsroom</a></li>
          <li><a href="${rootPath}pages/careers.html">Careers</a></li>
          <li><a href="${rootPath}pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Services</div>
        <ul class="footer-col-links">
          <li><a href="${rootPath}pages/services.html#tech">Technology</a></li>
          <li><a href="${rootPath}pages/services.html#digital">Digital Transform</a></li>
          <li><a href="${rootPath}pages/services.html#ai">AI & Data</a></li>
          <li><a href="${rootPath}pages/services.html#cloud">Cloud</a></li>
          <li><a href="${rootPath}pages/services.html#consulting">Consulting</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Solutions</div>
        <ul class="footer-col-links">
          <li><a href="${rootPath}pages/solutions.html#enterprise">Enterprise</a></li>
          <li><a href="${rootPath}pages/solutions.html#startup">Startups</a></li>
          <li><a href="${rootPath}pages/solutions.html#government">Government</a></li>
          <li><a href="${rootPath}pages/solutions.html#sme">SME</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Contact</div>
        <ul class="footer-col-links">
          <li><a href="mailto:hello@ielanedge.com">hello@ielanedge.com</a></li>
          <li><a href="#">India · Noida</a></li>
          <li><a href="#">Global Remote</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 ieLAN Edge. All rights reserved.</div>
      <div class="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>
<button class="back-to-top" id="backToTop" title="Back to top">↑</button>
<div class="install-banner" id="installBanner">
  <div class="install-banner-text"><strong>Install ieLAN Edge App</strong> — Access our platform anytime, even offline.</div>
  <div class="install-banner-actions">
    <button class="btn-install" id="btnInstall">Install App</button>
    <button class="btn-dismiss" id="btnDismiss">Not now</button>
  </div>
</div>`;
}

// Apply saved theme immediately to prevent flash of wrong theme
(function() {
  const t = localStorage.getItem('ielan-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();

// Inject nav + footer, then fire layout-ready so main.js can safely initialize
document.addEventListener('DOMContentLoaded', () => {
  const navEl    = document.getElementById('nav-inject');
  const footerEl = document.getElementById('footer-inject');
  const rootPath = navEl ? (navEl.dataset.root || '') : '';
  if (navEl)    navEl.outerHTML    = getNavHTML(rootPath);
  if (footerEl) footerEl.outerHTML = getFooterHTML(rootPath);
  document.dispatchEvent(new Event('layout-ready'));
});
