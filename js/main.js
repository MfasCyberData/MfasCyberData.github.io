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



  // V7.1 project browser: expertise filters + text search.
  const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
  const projectCards = [...document.querySelectorAll('.v7-project-card[data-project-category]')];
  const projectSearch = document.querySelector('[data-project-search]');
  const projectCount = document.querySelector('[data-project-count]');
  if (projectCards.length && (projectFilters.length || projectSearch)) {
    let activeFilter = 'all';
    let query = '';
    const locale = document.documentElement.lang === 'en' ? 'en' : 'fr';
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const applyProjectBrowser = () => {
      let visible = 0;
      projectCards.forEach(card => {
        const categories = (card.dataset.projectCategory || '').split(/\s+/).filter(Boolean);
        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
        const matchesQuery = !query || normalize(card.textContent).includes(query);
        const show = matchesFilter && matchesQuery;
        card.hidden = !show;
        card.classList.toggle('is-search-hidden', !show);
        if (show) visible += 1;
      });
      if (projectCount) {
        const noun = locale === 'fr' ? (visible > 1 ? 'projets' : 'projet') : (visible === 1 ? 'project' : 'projects');
        projectCount.textContent = `${visible} ${noun}`;
      }
    };
    projectFilters.forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.projectFilter || 'all';
        projectFilters.forEach(control => {
          const active = control === button;
          control.classList.toggle('is-active', active);
          control.setAttribute('aria-pressed', String(active));
        });
        applyProjectBrowser();
      });
    });
    if (projectSearch) {
      projectSearch.addEventListener('input', () => {
        query = normalize(projectSearch.value);
        applyProjectBrowser();
      });
      document.addEventListener('keydown', event => {
        if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        if (target && /input|textarea|select/i.test(target.tagName)) return;
        event.preventDefault();
        projectSearch.focus();
      });
    }
    applyProjectBrowser();
  }

  // Site-wide back-to-top control. It stays out of the way until useful.
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', document.documentElement.lang === 'fr' ? 'Revenir en haut de la page' : 'Back to top');
  backToTop.setAttribute('title', document.documentElement.lang === 'fr' ? 'Revenir en haut' : 'Back to top');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(backToTop);
  const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 560);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener('click', () => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    window.setTimeout(() => {
      const focusTarget = document.querySelector('header a, main a, main button');
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    }, reduced ? 0 : 450);
  });


  // V7.2.2: accessible homepage project-image zoom, with ESC / backdrop / focus restoration.
  const zoomControls = [...document.querySelectorAll('[data-portfolio-lightbox-src], [data-portfolio-lightbox-architecture]')];
  if (zoomControls.length) {
    const isFrench = document.documentElement.lang === 'fr';
    const modal = document.createElement('div');
    modal.className = 'v722-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', isFrench ? 'Image agrandie' : 'Enlarged image');
    const panel = document.createElement('div');
    panel.className = 'v722-modal-panel';
    const close = document.createElement('button');
    close.className = 'v722-modal-close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', isFrench ? 'Fermer l’image agrandie' : 'Close enlarged image');
    const body = document.createElement('div');
    body.className = 'v722-modal-body';
    panel.append(close, body);
    modal.append(panel);
    document.body.append(modal);
    let origin = null;
    let previousOverflow = '';
    const shut = () => {
      if (modal.hidden) return;
      modal.hidden = true;
      body.replaceChildren();
      document.body.style.overflow = previousOverflow;
      if (origin && origin.isConnected) origin.focus({ preventScroll: true });
      origin = null;
    };
    close.addEventListener('click', shut);
    modal.addEventListener('click', e => { if (e.target === modal) shut(); });
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); shut(); return; }
      if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
    });
    zoomControls.forEach(control => control.addEventListener('click', () => {
      origin = control;
      body.replaceChildren();
      if (control.hasAttribute('data-portfolio-lightbox-architecture')) {
        const original = control.closest('figure');
        const copy = original.cloneNode(true);
        copy.querySelectorAll('.v722-zoom-trigger').forEach(b => b.remove());
        copy.classList.add('v722-modal-architecture');
        body.append(copy);
      } else {
        const pic = document.createElement('img');
        pic.className = 'v722-modal-image';
        if (control.dataset.zoomNatural === 'yes') pic.classList.add('v723-modal-diagram');
        pic.src = control.dataset.portfolioLightboxSrc;
        pic.alt = control.dataset.portfolioLightboxCaption || control.closest('figure, .v72-proof-panel')?.querySelector('img')?.alt || '';
        body.append(pic);
      }
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      modal.hidden = false;
      close.focus();
    }));
  }

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
