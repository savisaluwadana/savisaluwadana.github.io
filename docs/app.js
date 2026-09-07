(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuButton && header && nav) {
    menuButton.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        header.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        header.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach((element) => revealObserver.observe(element));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const linkMap = new Map(navLinks.map((link) => [link.getAttribute('href').slice(1), link]));
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => link.classList.remove('is-active'));
      const active = linkMap.get(visible.target.id);
      if (active) active.classList.add('is-active');
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.01, 0.1, 0.25] });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
