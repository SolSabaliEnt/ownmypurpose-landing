(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); }
    });
  }
  document.querySelectorAll('[data-year]').forEach(el => {el.textContent=String(new Date().getFullYear())});
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', () => {
      const event = el.getAttribute('data-event');
      if (!/^[a-z0-9_]+$/.test(event || '')) return;
      if (typeof window.gtag === 'function') window.gtag('event', event);
    });
  });
})();