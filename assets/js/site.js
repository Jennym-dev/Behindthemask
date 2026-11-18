/* ==========================================================================
   Behind the Mask — Wiki layout script
   --------------------------------------------------------------------------
   Builds the parts every page shares, so a page only has to contain its own
   content:  background artwork · top navigation bar · footer ·
   character buttons · picture galleries · spoiler text.

   ▸ To add a page to the top menu, edit SITE.nav below.
   ▸ Each page tells this script who it is with <body data-page="…">.
   ▸ Pages inside a sub-folder add data-root="../" to <body>.
   ========================================================================== */

const SITE = {
  name: 'Behind the Mask Wiki',

  logo:       'assets/img/logo-nav.webp',
  background: 'assets/img/background.jpg',

  // Top navigation bar (centered). `id` must match <body data-page="…">.
  nav: [
    { id: 'home',       label: 'Home',       href: 'index.html' },
    { id: 'characters', label: 'Characters', href: 'characters.html' },
    { id: 'story',      label: 'Story',      href: 'story.html' },
    { id: 'chapters',   label: 'Chapters',   href: 'chapters.html' },
  ],

  // Characters — one line per character. This list builds the character
  // buttons on characters.html and the Characters dropdown in the top menu.
  // To add a character: copy characters/raven.html, edit it, add a line here.
  // group: 'protagonist' = Main Protagonist, 'main' = Main Routes, 'other' = Secondary Routes.
  // image: leave empty ('') until there is a picture — a black frame is shown.
  // focus: 'top' keeps the top of the picture in view when it's cropped (optional).
  characters: [
    { id: 'quinn', group: 'protagonist', name: 'Quinn', role: 'The Main Protagonist', route: 'Main Route', image: 'assets/img/quinn.jpg', focus: '25%', href: 'characters/quinn.html' },

    { id: 'raven', group: 'main',  name: 'Raven', role: 'The Biker Influencer',   route: 'Main Route', image: 'assets/img/biker.jpg',    href: 'characters/raven.html' },
    { id: 'titan', group: 'main',  name: 'Titan', role: 'The Gym Rat Influencer', route: 'Main Route', image: 'assets/img/gym-rat1.jpg', href: 'characters/titan.html' },

    { id: 'ghost', group: 'other', name: 'Ghost', role: 'The Military Man',       route: 'Secondary Route', image: 'assets/img/militaryman1.jpg', focus: 'top', href: 'characters/ghost.html' },
    { id: 'shade', group: 'other', name: 'Shade', role: 'The Ninja',              route: 'Secondary Route', image: 'assets/img/shade.jpg', href: 'characters/shade.html' },
    { id: 'viper', group: 'other', name: 'Viper', role: 'The First Criminal',     route: 'Secondary Route', image: 'assets/img/viper.jpg', focus: 'top', href: 'characters/viper.html' },
    { id: 'chaos', group: 'other', name: 'Chaos', role: 'The Second Criminal',    route: 'Secondary Route', image: 'assets/img/chaos.jpg', focus: 'top', href: 'characters/chaos.html' },
  ],

  // Headings used to group the characters in the top-menu dropdown
  characterGroups: [
    { id: 'protagonist', label: 'Main Protagonist' },
    { id: 'main',  label: 'Main Routes' },
    { id: 'other', label: 'Secondary Routes' },
  ],

  footer: {
    left:  `© ${new Date().getFullYear()} Behind the Mask Wiki`,
    right: 'Unofficial fan wiki',
  },
};

(() => {
  const body = document.body;
  const page = body.dataset.page || '';
  const root = body.dataset.root || '';
  const url  = (p) => (/^(https?:|#|\/)/.test(p) ? p : root + p);
  const esc  = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- background artwork + rain canvas ---------- */
  const bg = document.createElement('div');
  bg.className = 'wiki-bg';
  bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML = `<div class="wiki-bg__stage">
      <img src="${url(SITE.background)}" alt="" decoding="async" fetchpriority="high">
      <canvas id="rain" width="1672" height="941"></canvas>
    </div>`;
  body.prepend(bg);

  /* ---------- top navigation bar ---------- */
  // Which character page are we on? (used to highlight it in the dropdown)
  const here = decodeURI(location.pathname).replace(/\\/g, '/');
  const currentChar = (SITE.characters.find((c) => here.endsWith('/' + c.href)) || {}).id;

  // Characters dropdown, grouped by SITE.characterGroups
  const charMenu = () => `
    <div class="site-subnav">
      ${SITE.characterGroups.map((g) => {
        const list = SITE.characters.filter((c) => c.group === g.id);
        return list.length ? `
        <p class="site-subnav__title">${esc(g.label)}</p>
        <ul>${list.map((c) => `<li><a href="${url(c.href)}"${c.id === currentChar ? ' aria-current="page"' : ''}>${esc(c.name)}<span>${esc(c.role)}</span></a></li>`).join('')}</ul>` : '';
      }).join('')}
      <a class="site-subnav__all" href="${url('characters.html')}">All characters →</a>
    </div>`;

  const navItem = (n) => n.id === 'characters'
    ? `<li class="has-sub"><a href="${url(n.href)}"${n.id === page ? ' aria-current="page"' : ''}>${esc(n.label)}<span class="nav-caret" aria-hidden="true"></span></a>${charMenu()}</li>`
    : `<li><a href="${url(n.href)}"${n.id === page ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-logo" href="${url('index.html')}" aria-label="${esc(SITE.name)} — Home">
        <img src="${url(SITE.logo)}" alt="${esc(SITE.name)}">
      </a>
      <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul>${SITE.nav.map(navItem).join('')}</ul>
      </nav>
    </div>`;
  bg.after(header);

  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to content';
  body.prepend(skip);

  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.site-nav');
  const setMenu = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (!header.contains(e.target)) setMenu(false); });

  const main = document.getElementById('main');

  /* ---------- character buttons (characters.html) ---------- */
  // <div data-char-grid="main"> shows only that group; data-char-grid="" shows everyone
  document.querySelectorAll('[data-char-grid]').forEach((el) => {
    const group = el.dataset.charGrid;
    el.innerHTML = SITE.characters.filter((c) => !group || c.group === group).map((c) => `
      <a class="char-card" href="${url(c.href)}">
        <div class="char-card__image">${c.image ? `<img src="${url(c.image)}" alt="${esc(c.name)}" loading="lazy"${c.focus ? ` style="object-position: center ${esc(c.focus)}"` : ''}>` : ''}</div>
        <div class="char-card__body">
          <p class="char-card__name">${esc(c.name)}</p>
          <p class="char-card__meta">${esc(c.role)}</p>
          ${c.route ? `<span class="tag">${esc(c.route)}</span>` : ''}
        </div>
      </a>`).join('');
  });

  /* ---------- image galleries (infobox pictures with left / right buttons) ---------- */
  document.querySelectorAll('.gallery').forEach((g) => {
    const slides = [...g.querySelectorAll('.gallery__slide')];
    if (!slides.length) return;
    let i = 0;
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      if (count) count.textContent = `${i + 1} / ${slides.length}`;
    };
    let dots = [], count = null;
    if (slides.length > 1) {
      g.insertAdjacentHTML('beforeend', `
        <button class="gallery__btn gallery__btn--prev" type="button" aria-label="Previous picture">‹</button>
        <button class="gallery__btn gallery__btn--next" type="button" aria-label="Next picture">›</button>
        <span class="gallery__count"></span>
        <div class="gallery__dots">${slides.map((_, k) => `<button type="button" aria-label="Picture ${k + 1}"></button>`).join('')}</div>`);
      count = g.querySelector('.gallery__count');
      dots = [...g.querySelectorAll('.gallery__dots button')];
      g.querySelector('.gallery__btn--prev').addEventListener('click', () => show(i - 1));
      g.querySelector('.gallery__btn--next').addEventListener('click', () => show(i + 1));
      dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
      g.tabIndex = 0;
      g.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(i - 1);
        if (e.key === 'ArrowRight') show(i + 1);
      });
      // swipe on touch screens
      let x0 = null;
      g.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      g.addEventListener('touchend', (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
        x0 = null;
      });
    }
    show(0);
  });

  /* ---------- spoiler text (e.g. Secret Endings) ----------
     <span class="spoiler">…</span> starts blurred.
     Mouse: the whole text fades clear while the cursor is over it (CSS :hover).
     Touch screens: tap to reveal / tap again to hide.
     Keyboard: focusing the text reveals it. */
  document.querySelectorAll('.spoiler').forEach((el) => {
    // wrap each word in its own span so the blur works across line breaks
    const text = el.textContent;
    el.textContent = '';
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { el.append(part); return; }
      const w = document.createElement('span');
      w.className = 'spoiler__w';
      w.textContent = part;
      el.append(w);
    });

    let lastPointer = 'mouse';
    el.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; });
    el.addEventListener('click', () => {
      if (lastPointer !== 'mouse') el.classList.toggle('is-revealed');   // tap to reveal / hide
    });
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) el.classList.add('is-revealed'); }); // keyboard only
    el.addEventListener('blur', () => el.classList.remove('is-revealed'));
  });

  /* ---------- footer (inside the panel) ---------- */
  const panel = document.querySelector('.wiki-panel');
  if (panel) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `<span>${SITE.footer.left}</span><span>${SITE.footer.right}</span>`;
    panel.append(footer);
  }

  /* ---------- page title fallback ---------- */
  if (!document.title) {
    const h1 = main && main.querySelector('h1');
    document.title = h1 ? `${h1.textContent} — ${SITE.name}` : SITE.name;
  }
})();
