(() => {
  document.documentElement.classList.add('has-js');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('main-nav');

  if (toggle && menu) {
    const close = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const locale = document.documentElement.lang === 'en' ? 'en' : 'fr';
    const toggleName = (open) => {
      const name = locale === 'fr' ? (open ? 'Fermer le menu' : 'Ouvrir le menu') : (open ? 'Close menu' : 'Open menu');
      const label = toggle.querySelector('.sr-only');
      if (label) label.textContent = name;
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggleName(open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { close(); toggleName(false); }));
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !menu.classList.contains('is-open')) return;
      close();
      toggleName(false);
      toggle.focus();
    });
  }


  // HortiTrace: an optional guided reading. Both diagrams stay available.
  document.querySelectorAll('[data-architecture-walkthrough]').forEach(guide => {
    const comparison = guide.nextElementSibling;
    const explainer = guide.querySelector('[data-walkthrough-explainer]');
    const controls = [...guide.querySelectorAll('.walkthrough-button')];
    if (!comparison || !comparison.classList.contains('architecture-compare-detail') || !explainer) return;
    const notes = guide.dataset.locale === 'en' ? {
      all: 'Two architectures, one goal: keep business reports unchanged.',
      before: 'Before: the same transaction history was reloaded and then rescanned to calculate balances.',
      after: 'After: only recent records are reloaded; a historical snapshot makes reports faster without changing workflows.'
    } : {
      all: 'Deux architectures, un même objectif : des rapports métier inchangés.',
      before: 'Avant : la même histoire de transactions était rechargée, puis reparcourue pour calculer les balances.',
      after: 'Après : seuls les enregistrements récents sont rechargés ; un snapshot historique allège les rapports, sans changer les usages.'
    };
    controls.forEach(button => {
      button.addEventListener('click', () => {
        const selection = button.dataset.focus;
        if (!Object.prototype.hasOwnProperty.call(notes, selection)) return;
        controls.forEach(control => {
          const active = control === button;
          control.classList.toggle('is-active', active);
          control.setAttribute('aria-pressed', String(active));
        });
        comparison.dataset.focus = selection;
        explainer.textContent = notes[selection];
      });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll('.copy-email').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email || '';
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = document.documentElement.lang === 'fr' ? 'E-mail copié' : 'Email copied';
      } catch (_) {
        window.location.href = `mailto:${email}`;
      }
      window.setTimeout(() => { btn.textContent = original; }, 1700);
    });
  });


  const anchors = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('#main-nav a[href^="#"]')];
  if ('IntersectionObserver' in window && anchors.length && navLinks.length) {
    const map = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('is-current'));
        const active = map.get(entry.target.id);
        if (active) active.classList.add('is-current');
      });
    }, { rootMargin: '-24% 0px -62% 0px', threshold: 0 });
    anchors.forEach(section => observer.observe(section));
  }

  const tocLinks = [...document.querySelectorAll('.case-toc a[href^="#"]')];
  if ('IntersectionObserver' in window && tocLinks.length) {
    const sections = tocLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const map = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(a => a.classList.remove('is-current'));
        const active = map.get(entry.target.id);
        if (active) active.classList.add('is-current');
      });
    }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }
})();
