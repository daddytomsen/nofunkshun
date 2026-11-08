/* NOFUNKSHUN – Sprache, Termine, Spotify-Zwei-Klick */
(function () {
  var root = document.documentElement;

  /* ── Sprache ─────────────────────────────── */
  function setLang(l) {
    root.lang = l;
    root.dataset.lang = l;
    try { localStorage.setItem('nfs-lang', l); } catch (e) {}
    renderGigs();
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
  });

  /* ── Kopfleiste nach dem Hero füllen ─────── */
  var bar = document.querySelector('.bar');
  function onScroll() { bar.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.6); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Termine ─────────────────────────────── */
  var MON = {
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var T = {
    de: { tickets: 'Tickets', info: 'Infos', doors: 'Einlass', start: 'Beginn', next: 'Nächster Gig' },
    en: { tickets: 'Tickets', info: 'Info', doors: 'Doors', start: 'Start', next: 'Next show' }
  };

  // „2027-01-29“, „2019-05“ oder „2019“ → Teile; fehlende Teile bleiben leer
  function parts(d) {
    var p = String(d || '').split('-');
    return { y: +p[0] || 0, m: p[1] ? +p[1] : 0, d: p[2] ? +p[2] : 0 };
  }
  // Vergleichswert; bei unvollständigem Datum zählt das Ende des Zeitraums
  function key(g) {
    var p = parts(g.datum);
    return p.y * 10000 + (p.m || 12) * 100 + (p.d || 31);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function link(href, label, solid) {
    var a = el('a', 'btn' + (solid ? ' btn--solid' : ''), label);
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    return a;
  }
  // „Musikbunker Aachen“ + „Aachen“ → Stadt nicht doppelt nennen
  function place(g) {
    if (!g.stadt || g.ort.indexOf(g.stadt) !== -1) return g.ort;
    return g.ort + ', ' + g.stadt;
  }
  function whenText(g, l) {
    var p = parts(g.datum);
    if (p.d) return String(p.d).padStart(2, '0') + '.' + String(p.m).padStart(2, '0') + '.' + p.y;
    if (p.m) return MON[l][p.m - 1] + ' ' + p.y;
    return String(p.y);
  }

  function renderGigs() {
    var l = root.dataset.lang === 'en' ? 'en' : 'de';
    var gigs = (window.GIGS || []).filter(function (g) { return g && g.datum && g.ort; });
    var now = new Date();
    var today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    var next = gigs.filter(function (g) { return key(g) >= today; }).sort(function (a, b) { return key(a) - key(b); });
    var past = gigs.filter(function (g) { return key(g) < today; }).sort(function (a, b) { return key(b) - key(a); });

    var ulNext = document.getElementById('gigs-next');
    var ulPast = document.getElementById('gigs-past');
    ulNext.textContent = ''; ulPast.textContent = '';

    next.forEach(function (g) {
      var p = parts(g.datum);
      var li = el('li', 'gig');
      var date = el('div', 'gig__date');
      date.appendChild(el('span', 'gig__day', p.d ? String(p.d).padStart(2, '0') : '–'));
      date.appendChild(el('span', 'gig__mon', p.m ? MON[l][p.m - 1] : ''));
      date.appendChild(el('span', 'gig__year', String(p.y)));
      li.appendChild(date);

      var body = el('div', 'gig__body');
      body.appendChild(el('p', 'gig__where', place(g)));
      var meta = [];
      if (g[l]) meta.push(g[l]);
      if (g.einlass) meta.push(T[l].doors + ' ' + g.einlass);
      if (g.beginn) meta.push(T[l].start + ' ' + g.beginn);
      if (meta.length) body.appendChild(el('p', 'gig__meta', meta.join(' · ')));
      if (g.preis) body.appendChild(el('p', 'gig__meta', g.preis));
      li.appendChild(body);

      if (g.tickets || g.info) {
        var box = el('div', 'gig__links');
        if (g.tickets) box.appendChild(link(g.tickets, T[l].tickets, true));
        if (g.info) box.appendChild(link(g.info, T[l].info, false));
        li.appendChild(box);
      }
      ulNext.appendChild(li);
    });

    past.forEach(function (g) {
      var li = el('li', 'gig');
      var where = el('p', 'gig__where');
      where.appendChild(el('span', 'gig__when', whenText(g, l)));
      var name = place(g);
      if (g.info) { var a = el('a', null, name); a.href = g.info; a.target = '_blank'; a.rel = 'noopener'; where.appendChild(a); }
      else where.appendChild(document.createTextNode(name));
      li.appendChild(where);
      ulPast.appendChild(li);
    });

    document.getElementById('gigs-none').hidden = next.length > 0;
    document.querySelector('.past').hidden = past.length === 0;

    // Knopf im Hero: nächster Termin
    var btn = document.getElementById('next-gig-btn');
    if (next.length) {
      btn.textContent = '';
      btn.appendChild(el('span', 'hero__next-label', T[l].next));
      btn.appendChild(el('span', 'hero__next-what', whenText(next[0], l) + ' · ' + next[0].ort));
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }
  renderGigs();

  /* ── Inhalte beim Scrollen sanft einblenden ── */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var items = document.querySelectorAll('.sec > :not(.gallery), .gallery > a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (n, i) {
      n.classList.add('reveal');
      if (n.parentNode.classList.contains('gallery')) n.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(n);
    });
  }

  /* ── Spotify erst nach Klick laden ──────── */
  var sp = document.querySelector('[data-load-spotify]');
  if (sp) sp.addEventListener('click', function () {
    var box = document.getElementById('spotify-embed');
    var f = document.createElement('iframe');
    f.src = 'https://open.spotify.com/embed/artist/3h1Febi28MziUNpcq5khGA?theme=0';
    f.title = 'Nofunkshun auf Spotify';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    box.textContent = '';
    box.classList.add('is-loaded');
    box.appendChild(f);
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
