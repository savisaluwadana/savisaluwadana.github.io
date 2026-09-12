(() => {
  const CONTACT_EMAIL = 'savisaluwadana@gmail.com';
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

  root.classList.add('motion-ready');

  // Add the portfolio tech stack only on the homepage. Keeping it injected here
  // avoids changing the structure or styling of the existing secondary pages.
  const focusSection = document.querySelector('#focus');
  if (focusSection && !document.querySelector('#tech-stack')) {
    const techStyles = document.createElement('link');
    techStyles.rel = 'stylesheet';
    techStyles.href = '/tech-stack.css';
    document.head.appendChild(techStyles);

    const techSection = document.createElement('section');
    techSection.className = 'section tech-stack-section';
    techSection.id = 'tech-stack';
    techSection.setAttribute('aria-labelledby', 'tech-stack-title');
    techSection.innerHTML = `
      <div class="shell">
        <div class="tech-stack-heading reveal">
          <div>
            <p class="section-index">Stack / Technologies I build with</p>
            <h2 id="tech-stack-title">The tools behind the systems.</h2>
          </div>
          <p>A practical stack across product engineering, backend systems, cloud infrastructure, automation and data — chosen around the problem rather than a single framework.</p>
        </div>

        <div class="tech-stack-grid reveal">
          <article class="tech-group">
            <div class="tech-group-top"><span>01</span><span>Software engineering</span></div>
            <h3>Languages, frameworks & product development</h3>
            <div class="tech-pills" aria-label="Languages, frameworks and product technologies">
              <span>Go</span><span>Java</span><span>Spring Boot</span><span>Laravel</span><span>TypeScript</span><span>JavaScript</span><span>Python</span><span>C# / .NET</span><span>C++</span><span>Kotlin</span><span>HTML</span><span>CSS</span><span>React</span><span>Next.js</span><span>Angular</span><span>Node.js</span><span>Flutter</span><span>Electron</span><span>Wails</span><span>Django</span><span>Flask</span>
            </div>
          </article>

          <article class="tech-group">
            <div class="tech-group-top"><span>02</span><span>Platform & operations</span></div>
            <h3>Cloud-native & automation</h3>
            <div class="tech-pills" aria-label="Platform and DevOps technologies">
              <span>Kubernetes</span><span>Docker</span><span>Terraform</span><span>Ansible</span><span>Jenkins</span><span>Linux</span><span>Bash / Shell</span><span>CI/CD</span><span>Virtualization</span>
            </div>
          </article>

          <article class="tech-group">
            <div class="tech-group-top"><span>03</span><span>Data layer</span></div>
            <h3>Databases & application data</h3>
            <div class="tech-pills" aria-label="Database technologies">
              <span>PostgreSQL</span><span>MongoDB</span><span>MySQL</span>
            </div>
          </article>

          <article class="tech-group">
            <div class="tech-group-top"><span>04</span><span>Cloud & workflow</span></div>
            <h3>Cloud platforms & engineering tools</h3>
            <div class="tech-pills" aria-label="Cloud platforms and engineering tools">
              <span>AWS</span><span>Azure</span><span>Google Cloud</span><span>Git</span><span>Azure Repos</span><span>Postman</span><span>Jira</span>
            </div>
          </article>
        </div>

        <p class="tech-stack-note reveal">The emphasis is on end-to-end engineering: product code, APIs and data models through deployment, infrastructure automation and operating the software in production.</p>
      </div>`;

    focusSection.parentNode.insertBefore(techSection, focusSection);

    if (nav) {
      const focusLink = nav.querySelector('a[href="#focus"]');
      if (focusLink && !nav.querySelector('a[href="#tech-stack"]')) {
        const stackLink = document.createElement('a');
        stackLink.href = '#tech-stack';
        stackLink.textContent = 'Stack';
        nav.insertBefore(stackLink, focusLink);
      }
    }
  }

  // Keep the portfolio current with the latest product and systems work without
  // disturbing the established case-study markup in index.html.
  const projectGrid = document.querySelector('#work .project-grid');
  const proofLinks = document.querySelector('.proof-links');
  const recentProjects = [
    {
      id: 'advance-hris',
      number: '08',
      category: 'HR operations platform',
      type: 'Local-first HRIS + desktop operations',
      name: 'Advance HRIS',
      description: 'A hybrid HR information system with an employee web portal, a native HR/admin desktop console, tenant-scoped access, policy-backed leave, schedule-aware attendance, audit history and durable offline synchronization.',
      architecture: 'Next.js Web + Wails / React Desktop → Go API → PostgreSQL',
      tags: ['Go', 'Next.js', 'Wails', 'PostgreSQL', 'Offline sync', 'RBAC'],
      footer: 'The system combines cloud-authoritative HR data with a local-first desktop workflow, encrypted local payloads, conflict-aware sync and payroll-ready attendance boundaries.',
      href: 'https://github.com/savisaluwadana/Advance-HIRS-System',
      linkLabel: 'View repository ↗'
    },
    {
      id: 'nexus-pos',
      number: '09',
      category: 'Retail operations system',
      type: 'Point of sale + Electron desktop',
      name: 'NexusPOS',
      description: 'A retail POS and store-operations system covering touch checkout, barcode workflows, inventory, staff roles, cash shifts, refunds, reconciliation, audit history and native receipt printing.',
      architecture: 'Next.js / React → Prisma → MongoDB + Electron',
      tags: ['Electron', 'POS', 'Inventory', 'Prisma', 'MongoDB', 'RBAC'],
      footer: 'Built as more than a checkout screen: the system handles stock-safe transactions, cash-drawer operations, refunds, reporting and multi-platform desktop packaging.',
      href: '',
      linkLabel: 'Private product build'
    },
    {
      id: 'academix',
      number: '10',
      category: 'Education operations SaaS',
      type: 'Student, fees & academic operations',
      name: 'Academix',
      description: 'A SaaS workspace for tuition centres and private institutes combining student CRM, classes, attendance, assessments, fee collection, communications, reporting and multi-site institute operations.',
      architecture: 'Next.js → MongoDB / Mongoose → notification integrations',
      tags: ['Next.js', 'TypeScript', 'MongoDB', 'Attendance', 'Fees', 'Multi-site'],
      footer: 'The product consolidates academic and operational workflows into a role-aware workspace with SaaS plan surfaces, reporting and extensible notification integrations.',
      href: 'https://github.com/savisaluwadana/student-management-system-saas',
      linkLabel: 'View repository ↗'
    },
    {
      id: 'acme-accounting',
      number: '11',
      category: 'Financial operations SaaS',
      type: 'Double-entry accounting system',
      name: 'Acme Accounting',
      description: 'A full-stack accounting application with a double-entry general ledger, invoicing, A/R and A/P aging, vendor bills, credit notes, refunds, period locks, bank reconciliation, budgeting and financial reporting.',
      architecture: 'Next.js → MongoDB / Mongoose → double-entry ledger',
      tags: ['Accounting', 'General ledger', 'A/R + A/P', 'Reconciliation', 'Reporting', 'Controls'],
      footer: 'Accounting integrity is enforced at the posting layer with balanced journals, reversible history, period controls and ledger-backed financial statements instead of dashboard-only bookkeeping.',
      href: '',
      linkLabel: 'Private product build'
    }
  ];

  if (projectGrid) {
    recentProjects.forEach((project) => {
      if (document.getElementById(project.id)) return;

      const tags = project.tags.map((tag) => `<span>${tag}</span>`).join('');
      const action = project.href
        ? `<a href="${project.href}" target="_blank" rel="noreferrer">${project.linkLabel}</a>`
        : `<span class="project-private-label">${project.linkLabel}</span>`;

      projectGrid.insertAdjacentHTML('beforeend', `
        <article class="project-card project-card--product reveal" id="${project.id}">
          <div class="project-topline"><span>${project.number}</span><span>${project.category}</span></div>
          <div class="project-body">
            <p class="project-type">${project.type}</p>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="architecture-line" aria-label="${project.name} architecture">${project.architecture}</div>
            <div class="project-tags">${tags}</div>
          </div>
          <div class="project-footer">
            <p>${project.footer}</p>
            ${action}
          </div>
        </article>`);
    });
  }

  if (proofLinks) {
    recentProjects.forEach((project) => {
      if (proofLinks.querySelector(`a[href="#${project.id}"]`)) return;
      const link = document.createElement('a');
      link.href = `#${project.id}`;
      link.textContent = project.name;
      proofLinks.appendChild(link);
    });
  }

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
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

// Deployment refresh after reverting project visuals.
