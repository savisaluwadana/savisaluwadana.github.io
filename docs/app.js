(() => {
  const CONTACT_EMAIL = 'savisaluwadana@gmail.com';

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

  const contactStyles = document.createElement('style');
  contactStyles.textContent = `
    .contact-grid{position:relative;z-index:2;display:grid;grid-template-columns:.78fr 1.22fr;gap:18px;margin-top:34px;text-align:left}
    .contact-panel,.contact-form{border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(7,9,12,.52);box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
    .contact-panel{padding:24px;display:flex;flex-direction:column;justify-content:space-between;min-height:100%}
    .contact-panel__label{display:block;color:#697383;font-size:.64rem;font-weight:850;letter-spacing:.14em;text-transform:uppercase;margin-bottom:13px}
    .contact-panel h3{margin:0;font-size:1.22rem;letter-spacing:-.035em}
    .contact-panel p{margin:10px 0 22px!important;color:#858f9d!important;font-size:.88rem!important;line-height:1.65!important}
    .contact-email{display:inline-flex;align-items:center;gap:8px;color:#f2f5f8;font:650 .86rem ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
    .contact-email span{color:#8ab4ff}
    .contact-quick{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}
    .contact-mini{border:1px solid rgba(255,255,255,.095);background:rgba(255,255,255,.035);color:#cbd2db;border-radius:10px;padding:9px 11px;font-size:.74rem;font-weight:700;cursor:pointer}
    .contact-mini:hover{border-color:rgba(255,255,255,.18);color:#fff}
    .contact-form{padding:24px}
    .contact-form__row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .contact-field{display:grid;gap:7px;margin-bottom:12px}
    .contact-field label{color:#7c8693;font-size:.68rem;font-weight:800;letter-spacing:.075em;text-transform:uppercase}
    .contact-field input,.contact-field select,.contact-field textarea{width:100%;border:1px solid rgba(255,255,255,.095);border-radius:11px;background:#090c10;color:#edf1f5;padding:12px 13px;outline:none;transition:border-color .2s ease,box-shadow .2s ease}
    .contact-field input:focus,.contact-field select:focus,.contact-field textarea:focus{border-color:rgba(138,180,255,.55);box-shadow:0 0 0 3px rgba(138,180,255,.08)}
    .contact-field textarea{resize:vertical;min-height:118px}
    .contact-form__footer{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:5px}
    .contact-note{margin:0!important;color:#68717e!important;font-size:.7rem!important;line-height:1.45!important;max-width:300px}
    .contact-submit{border:0;cursor:pointer;white-space:nowrap}
    .contact-status{min-height:18px;margin:10px 0 0!important;color:#71e5a6!important;font-size:.72rem!important}
    @media(max-width:780px){.contact-grid{grid-template-columns:1fr}.contact-form__row{grid-template-columns:1fr}.contact-form__footer{align-items:flex-start;flex-direction:column}.contact-submit{width:100%}}
  `;
  document.head.appendChild(contactStyles);

  const connectCard = document.querySelector('#connect .connect-card');
  if (connectCard && !connectCard.querySelector('[data-contact-form]')) {
    const actions = connectCard.querySelector('.connect-actions');
    if (actions) actions.remove();

    const contactMarkup = document.createElement('div');
    contactMarkup.className = 'contact-grid';
    contactMarkup.innerHTML = `
      <aside class="contact-panel" aria-label="Direct contact details">
        <div>
          <span class="contact-panel__label">Direct contact</span>
          <h3>Have an engineering problem worth solving?</h3>
          <p>For engineering roles, product collaborations, open-source work, platform engineering, AI infrastructure, DevOps, Kubernetes or technical partnerships, email me directly.</p>
          <a class="contact-email" href="mailto:${CONTACT_EMAIL}"><span>→</span>${CONTACT_EMAIL}</a>
        </div>
        <div class="contact-quick">
          <a class="contact-mini" href="mailto:${CONTACT_EMAIL}">Email directly ↗</a>
          <button class="contact-mini" type="button" data-copy-email>Copy email</button>
          <a class="contact-mini" href="/contact.html">Contact page ↗</a>
        </div>
      </aside>
      <form class="contact-form" data-contact-form>
        <div class="contact-form__row">
          <div class="contact-field"><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" required placeholder="Your name"></div>
          <div class="contact-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"></div>
        </div>
        <div class="contact-form__row">
          <div class="contact-field"><label for="contact-topic">Reason</label><select id="contact-topic" name="topic"><option>Engineering opportunity</option><option>AI / agent systems</option><option>Platform engineering / DevOps</option><option>Open source collaboration</option><option>Product / consulting discussion</option><option>Other</option></select></div>
          <div class="contact-field"><label for="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" required placeholder="What would you like to discuss?"></div>
        </div>
        <div class="contact-field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" required placeholder="Tell me about the problem, role, product or collaboration..."></textarea></div>
        <div class="contact-form__footer">
          <p class="contact-note">Your message stays in your browser. Submit opens your email app with the draft prepared.</p>
          <button class="button button--primary contact-submit" type="submit">Prepare email <span aria-hidden="true">↗</span></button>
        </div>
        <p class="contact-status" role="status" aria-live="polite" data-contact-status></p>
      </form>`;

    const orbit = connectCard.querySelector('.connect-orbit');
    connectCard.insertBefore(contactMarkup, orbit || null);
  }

  const handleContactForms = () => {
    document.querySelectorAll('[data-contact-form]').forEach((form) => {
      if (form.dataset.ready === 'true') return;
      form.dataset.ready = 'true';
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const replyEmail = String(data.get('email') || '').trim();
        const topic = String(data.get('topic') || 'Website inquiry').trim();
        const subject = String(data.get('subject') || 'Website inquiry').trim();
        const message = String(data.get('message') || '').trim();
        const mailSubject = `[Website] ${topic}: ${subject}`;
        const body = [
          `Hi Savi,`,
          '',
          message,
          '',
          '---',
          `Name: ${name}`,
          `Reply email: ${replyEmail}`,
          `Topic: ${topic}`,
          `Sent from: ${window.location.href}`
        ].join('\n');

        const status = form.querySelector('[data-contact-status]');
        if (status) status.textContent = 'Opening your email app with the message prepared…';
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
      });
    });
  };

  handleContactForms();

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        const original = button.textContent;
        button.textContent = 'Copied ✓';
        window.setTimeout(() => { button.textContent = original; }, 1600);
      } catch {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      }
    });
  });

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
