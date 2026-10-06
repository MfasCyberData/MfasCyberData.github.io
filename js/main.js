(() => {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('main-nav');

  if (toggle && menu) {
    const close = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
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
