(() => {
  const CONTACT_EMAIL = 'savisaluwadana@gmail.com';
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

  root.classList.add('motion-ready');

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const syncThemeButtons = () => {
    const isLight = root.dataset.theme === 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(isLight));
      button.textContent = isLight ? 'Dark' : 'Light';
    });
  };

  syncThemeButtons();
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLight = root.dataset.theme !== 'light';
      if (nextLight) {
        root.dataset.theme = 'light';
      } else {
        delete root.dataset.theme;
      }
      try {
        localStorage.setItem('theme', nextLight ? 'light' : 'dark');
      } catch {}
      syncThemeButtons();
    });
  });

  document.querySelectorAll('[data-blueprint-tabs]').forEach((container) => {
    const tabs = [...container.querySelectorAll('[role="tab"]')];
    const panels = [...container.querySelectorAll('[role="tabpanel"]')];

    const activate = (nextTab) => {
      const targetId = nextTab.getAttribute('aria-controls');
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const target = tabs[(index + delta + tabs.length) % tabs.length];
        activate(target);
        target.focus();
      });
    });
  });

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

  const revealNodes = [...document.querySelectorAll('.reveal')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    revealNodes.forEach((node) => observer.observe(node));
  }

  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const sections = [...document.querySelectorAll('main section[id]')];

  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const links = new Map(navLinks.map((link) => [link.getAttribute('href').slice(1), link]));
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => link.classList.remove('is-active'));
      const active = links.get(current.target.id);
      if (active) active.classList.add('is-active');
    }, { rootMargin: '-30% 0px -60% 0px', threshold: [0.01, 0.15] });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        button.textContent = 'Copied';
      } catch {
        button.textContent = CONTACT_EMAIL;
      }
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  });

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const topic = String(data.get('topic') || 'General').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !subject || !message) return;

      const mailSubject = `[${topic}] ${subject}`;
      const mailBody = [
        `Hi Savi,`,
        ``,
        message,
        ``,
        `—`,
        `${name}`,
        `${email}`
      ].join('\n');

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    });
  });
})();
