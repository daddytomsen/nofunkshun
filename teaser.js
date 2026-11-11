/* Bauteil „Teaser“: Vorgeschmack auf einen neuen Song. Das Logo im Startbereich wird zum Equalizer.

   Daten: window.NFS_TEASER (erzeugt von scripts/web_teaser.py im Videoprojekt): Spektrum und Kick sind vorab
   gerechnet (50 Bilder/s, 32 Bänder, je 1 Byte). Das Bild folgt audio.currentTime. Kein Web Audio, kein
   AudioContext: läuft auf dem iPhone wie am Rechner und kostet keine FFT im Browser.

   Grundstil (gewählt am 10.11.2026: Raster, wie eine TV-Bildstörung von früher, mit Testbild):
   Das Logo wird aus waagerechten Zeilen aufgebaut wie ein Fernsehbild.

   GEWÄHLT ist die Mischung „mix“, das ist der Standard:
     Anfang  wie testbild: im Break steht das Testbild im Logo, auf dem Fill läuft das Bild durch,
             auf dem Einsatz rastet es ein
     Song    wie stoerung: Zeilenstärke = Pegel. Auf JEDER Snare wackelt das Logo: kurzer Ruck zur Seite,
             die rostrote Lage verrutscht, ein paar Zeilen reißen. Die Snare-Zeiten sind vorab gemessen
             (T.snare), deshalb bleibt es den ganzen Song über im Takt.
     Schluss wie testbild: Testbild, dann fällt das Bild zu Strich und Punkt zusammen (Röhre aus)
     Danach  taucht das normale Logo über 1,5 s wieder auf, erst zart, dann kräftiger, mit zwei kurzen
             Glitches, so wie es im Startbereich auch sonst glitcht

   Die drei Ausgangs-Spielarten bleiben wählbar über data-teaser-stil (im Prototyp ?stil=… in der Adresse):

     stoerung  Zeilenstärke = Pegel (unten Bass, oben Höhen), wie der gewählte Entwurf. Dazu echte Bildstörung:
               auf dem Fill reißt das Bild und rollt durch, auf dem Einsatz rastet es ein. Nach dem Schlussschlag
               verliert es das Signal (Risse, Schnee) und fängt sich als normales Logo wieder.

     pegel     Mehr Equalizer: Jede Zeile leuchtet von der Mitte aus so weit, wie ihr Band laut ist. Im Logo
               steht damit ein Spektrum. Ein Spitzenwert hält kurz. Störung nur als kurzer Riss.

     testbild  Im Break steht ein Testbild im Logo (Graustufen-Balken, einer rostrot). Auf dem Fill läuft das
               Bild durch, auf dem Einsatz rastet es ein. Im Song sind die acht Balken der Equalizer (links Bass,
               rechts Höhen). Am Schluss: Testbild, dann fällt das Bild wie bei einer Röhre zu einem Strich und
               einem Punkt zusammen.

   Immer gleich: Das Logo kehrt danach in Lage, Aussehen und Verhalten genau zurück (weiches Überblenden).
   Der Songtitel läuft von links nach rechts voll und zeigt so den Fortschritt (kein Balken).
   Verworfene Entwürfe (nicht in diesem Repo): Pegelwand + Logo in Streifen, Konturen-Echo, Titel als Plakat.

   Ohne JS, ohne Daten oder bei „Bewegung reduzieren“ bleibt die Seite, wie sie ist (dann nur Ton und der
   volllaufende Titel). Der Ton lädt erst beim Einschalten. Störung und Schnee bleiben auf die Fläche des
   Logos begrenzt und dauern je höchstens 0,8 s (Rücksicht auf Lichtempfindliche). */
(function () {
  'use strict';
  var T = window.NFS_TEASER;
  var root = document.querySelector('[data-teaser]');
  if (!T || !root) return;

  var STIL = root.getAttribute('data-teaser-stil') || 'mix';
  var AUSLAUF = 1500;                      // ms, in denen das normale Logo wieder auftaucht
  var hero = root.closest('.hero');
  var logo = hero.querySelector('.hero__logo img');
  var canvas = hero.querySelector('.hero__eq');
  var ctx = canvas.getContext('2d');
  var knopf = root.querySelector('.teaser__btn');
  var zeit = root.querySelector('.teaser__time');
  var fehler = root.querySelector('.teaser__error');
  var mini = document.querySelector('.teaser-mini');
  var miniZeit = mini && mini.querySelector('.teaser-mini__time');
  var css = getComputedStyle(document.documentElement);
  var INK = (css.getPropertyValue('--ink') || '#ece7dd').trim();
  var BG = (css.getPropertyValue('--bg') || '#0b0b0b').trim();
  var AKZENT = (css.getPropertyValue('--accent') || '#d8452b').trim();
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
  var M = T.marken;
  hero.setAttribute('data-eq-stil', STIL);

  function bytes(b64) {
    var s = atob(b64), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  var P = bytes(T.pegel), K = bytes(T.kick), B = T.baender, F = T.bilder;
  var stand = new Float32Array(B), spitze = new Float32Array(B), halt = new Float32Array(B);
  var kick = 0, hoch = 0, burst = null, gesetztBass = -1, gesetztHoch = -1;
  var SNARE = T.snare || [], wackel = 0, wackelSeit = 9, snareNr = 0;   // Wackeln auf der Snare
  var blende = 0;                          // 0 = normales Logo, 1 = Equalizer voll da

  var audio = new Audio();
  audio.preload = 'none';
  var tonUrl = T.tonUrl || (root.getAttribute('data-teaser-base') || '') + T.ton;

  var an = false;          // läuft der Vorgeschmack?
  var imBild = true;       // Startbereich sichtbar?
  var knopfImBild = true;
  var raf = 0, letztes = 0, auslauf = 0;   // auslauf = Zeitpunkt (ms), bis zu dem zurückgeblendet wird
  var ankerT = 0, ankerJetzt = 0, letzteC = -1;
  var geo = null, hilf = null;

  // ── Zeit und Fortschritt ─────────────────────────────────────────
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function zeigeZeit(t) {
    if (typeof t !== 'number') t = an ? Math.min(audio.currentTime, T.dauer) : 0;
    var text = fmt(t) + ' / ' + fmt(Math.round(T.dauer));
    if (zeit.textContent !== text) zeit.textContent = text;
    if (miniZeit && miniZeit.textContent !== text) miniZeit.textContent = text;
    root.style.setProperty('--teaser-p', (t / T.dauer).toFixed(4));   // der Songtitel läuft voll
  }
  // currentTime springt je nach Browser nur alle 20-250 ms weiter. Dazwischen mit der Uhr weiterzählen,
  // sonst ruckelt das Bild gegen den Ton.
  function songZeit(jetzt) {
    var c = audio.currentTime;
    if (c !== letzteC) { letzteC = c; ankerT = c; ankerJetzt = jetzt; }
    var t = ankerT + (audio.paused ? 0 : (jetzt - ankerJetzt) / 1000);
    return Math.min(T.dauer, Math.max(0, t));
  }
  function mittel(arr, von, bis) { var s = 0; for (var i = von; i < bis; i++) s += arr[i]; return s / (bis - von); }
  function flaeche(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // Zufall ohne Zufall: gleiche Zahl für gleiche Eingabe, damit die Störung bei jedem Abspielen gleich aussieht
  function rausch(a, b) { var x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); }
  // Hüllkurve: 0 vor t0, steigt in „auf“ s auf 1, hält „halte“ s, fällt in „ab“ s auf 0
  function huelle(t, t0, auf, halte, ab) {
    var d = t - t0;
    if (d < 0) return 0;
    if (d < auf) return d / auf;
    if (d < auf + halte) return 1;
    if (d < auf + halte + ab) return 1 - (d - auf - halte) / ab;
    return 0;
  }

  // ── Geometrie (nur bei Größenänderung, nicht je Bild) ─────────────
  // Die Zeichenfläche liegt IM Logo (<h1 class="hero__logo">) und steht seitlich um 14 %, oben und unten um
  // 6 % über. So macht sie jede Bewegung des Startbereichs mit (Einblenden, Wegscrollen), und Risse haben
  // seitlich Platz. Gemessen wird mit offsetWidth/-Height: die bleiben gleich, auch wenn der Startbereich
  // beim Scrollen skaliert wird.
  var RANDX = 0.14, RANDY = 0.06;
  function vermesse() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var lw = logo.offsetWidth * dpr, lh = logo.offsetHeight * dpr;
    canvas.width = Math.round(lw * (1 + 2 * RANDX));
    canvas.height = Math.round(lh * (1 + 2 * RANDY));
    geo = { dpr: dpr, w: canvas.width, h: canvas.height, lx: lw * RANDX, ly: lh * RANDY, lw: lw, lh: lh };
    geo.cx = geo.lx + geo.lw / 2; geo.cy = geo.ly + geo.lh / 2;
    geo.W = Math.round(geo.lw); geo.H = Math.round(geo.lh);
    hilf.a.width = hilf.b.width = geo.W; hilf.a.height = hilf.b.height = geo.H;
    geo.zeilen = Math.max(28, Math.round(geo.H / ((STIL === 'pegel' ? 7.5 : 5.5) * dpr)));
  }

  // ── Pegel je Bild ────────────────────────────────────────────────
  function miss(t, dt, live) {
    var fi = Math.min(F - 1.001, Math.max(0, t * T.fps)), i0 = fi | 0, fr = fi - i0, b;
    var kraft = live ? (t < M.einsatz ? 0.5 : 1) : 0;   // im Break hält sich alles zurück
    hoch = 0;
    for (b = 0; b < B; b++) {
      var l = live ? (P[i0 * B + b] * (1 - fr) + P[(i0 + 1) * B + b] * fr) / 255 * kraft : 0;
      stand[b] = l > stand[b] ? l : Math.max(l, stand[b] - 1.9 * dt);   // sofort hoch, langsam runter
      if (stand[b] >= spitze[b]) { spitze[b] = stand[b]; halt[b] = 0.3; }
      else if ((halt[b] -= dt) < 0) spitze[b] = Math.max(stand[b], spitze[b] - 0.8 * dt);
      if (b >= B - 10) hoch += stand[b] / 10;
    }
    var k = live ? (K[i0] * (1 - fr) + K[i0 + 1] * fr) / 255 * kraft : 0;
    kick = Math.max(k, kick - 3.2 * dt);
    // Snare: jüngster Schlag vor t. Hüllkurve klingt in gut 0,1 s ab.
    wackel = 0; wackelSeit = 9;
    if (live && SNARE.length) {
      if (snareNr >= SNARE.length || SNARE[snareNr][0] > t) snareNr = 0;          // zurückgespult oder neu gestartet
      while (snareNr + 1 < SNARE.length && SNARE[snareNr + 1][0] <= t) snareNr++;
      var ds = t - SNARE[snareNr][0];
      if (ds >= 0 && ds < 0.45) { wackelSeit = ds; wackel = SNARE[snareNr][1] * Math.exp(-ds / 0.11); }
    }
    burst = null;
    for (b = 0; live && b < T.bursts.length; b++) {
      var d = t - T.bursts[b];
      if (d >= 0 && d < 0.11) { burst = T.bursts[b]; break; }
    }
  }

  // ── Zeilenbild des Logos in die Hilfsfläche a ────────────────────
  // schnitt(r, p, x): stanzt in Zeile r (Höhe p) Luft heraus. deck(x0, x1, d): Bereich auf Deckung d bringen.
  function zeilenbild(maler) {
    var g = geo, x = hilf.a.getContext('2d'), p = g.H / g.zeilen, r;
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, g.W, g.H);
    x.drawImage(logo, 0, 0, g.W, g.H);
    if (maler.faerbe) maler.faerbe(x);
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = '#000';
    for (r = 0; r < g.zeilen; r++) {
      maler.zeile(r, function (x0, x1, d) {
        var luft = p * (1 - Math.min(1, d));
        if (luft > 0.25 && x1 > x0) { x.fillRect(x0, r * p, x1 - x0, luft / 2); x.fillRect(x0, (r + 1) * p - luft / 2, x1 - x0, luft / 2); }
      });
    }
  }
  function bandDerZeile(r) { return Math.round((1 - r / (geo.zeilen - 1)) * (B - 1)); }   // unten Bass, oben Höhen

  // ── Bild auf die Bühne: mit Rissen, Durchlaufen, Passerfehler ─────
  // riss 0..1 = waagerechte Risse, roll = Anteil der Bildhöhe, um den das Bild nach unten durchläuft,
  // rot = Versatz der rostroten Lage (Anteil der Logobreite), ky/kx = Zusammenfallen (Röhre aus),
  // schub = das ganze Bild ruckt zur Seite (Anteil der Logobreite, mit Vorzeichen)
  function aufDieBuehne(t, o) {
    var g = geo, sc = 1 + 0.025 * kick + 0.02 * wackel, w = g.lw * sc, h = g.lh * sc, X = g.cx - w / 2, Y = g.cy - h / 2;
    var nr = Math.floor(t * 30), i;
    if (o.ky < 1 || o.kx < 1) {                                        // Röhre aus: erst Strich, dann Punkt
      var hh = Math.max(2 * g.dpr, h * o.ky), ww = w * o.kx;
      ctx.globalAlpha = o.alpha;
      if (o.ky > 0.04) ctx.drawImage(hilf.a, g.cx - ww / 2, g.cy - hh / 2, ww, hh);
      else { ctx.fillStyle = INK; ctx.fillRect(g.cx - ww / 2, g.cy - hh / 2, ww, hh); }
      ctx.globalAlpha = 1;
      return;
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(0, Y - 2, g.w, h + 4); ctx.clip();        // nichts läuft aus der Logofläche heraus
    function lage(bild, dx0, dy0) {
      var teile = o.riss > 0.01 || o.roll > 0.001 ? 22 : 1, th = h / teile, sh = g.H / teile, hv = h * 1.14;
      for (i = 0; i < teile; i++) {
        var dx = dx0 + (o.schub || 0) * g.lw;
        if (o.riss > 0.01 && rausch(i, nr) > 0.55) dx += o.riss * g.lw * 0.16 * (rausch(i + 9, nr) - 0.5) * 2;
        var y = i * th + o.roll * hv;
        y = ((y % hv) + hv) % hv;                                       // unten raus, oben wieder rein, mit Dunkelbalken
        ctx.drawImage(bild, 0, i * sh, g.W, sh, X + dx, Y + y + dy0, w, th + 0.6);
        if (y + th > h) ctx.drawImage(bild, 0, i * sh, g.W, sh, X + dx, Y + y - hv + dy0, w, th + 0.6);
      }
    }
    ctx.globalAlpha = o.alpha;
    if (o.rot > 0.004) {                                                // rostrote Lage dahinter (Passerfehler)
      var y2 = hilf.b.getContext('2d');
      y2.globalCompositeOperation = 'source-over';
      y2.clearRect(0, 0, g.W, g.H);
      y2.drawImage(hilf.a, 0, 0);
      y2.globalCompositeOperation = 'source-in';
      y2.fillStyle = AKZENT;
      y2.fillRect(0, 0, g.W, g.H);
      lage(hilf.b, g.lw * o.rot, g.lw * o.rot * 0.6);
    }
    lage(hilf.a, 0, 0);
    if (o.schnee > 0.01) {                                              // Schnee: kurze helle Striche
      ctx.fillStyle = INK;
      var n = Math.round(90 * o.schnee);
      for (i = 0; i < n; i++) {
        ctx.globalAlpha = o.alpha * (0.15 + 0.5 * rausch(i, nr + 3));
        ctx.fillRect(X - g.lw * 0.06 + rausch(i + 1, nr) * w * 1.12, Y + rausch(i + 2, nr) * h,
                     (4 + rausch(i + 5, nr) * 44) * g.dpr, (1 + Math.round(rausch(i + 6, nr))) * g.dpr);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── Stil „stoerung“ ──────────────────────────────────────────────
  function stilStoerung(t, live) {
    zeilenbild({ zeile: function (r, deck) {
      deck(0, geo.W, 0.13 + 1.1 * Math.pow(stand[bandDerZeile(r)], 0.8));
    } });
    // Fill: Bild reißt und läuft durch, rastet auf dem Einsatz ein. Schluss: Signal weg.
    var vor = live ? huelle(t, M.fill, M.einsatz - M.fill - 0.04, 0, 0.06) : 0;
    var ende = live ? huelle(t, M.schluss + 0.05, 0.3, 9, 0) : (blende > 0 ? blende : 0);
    var s = Math.max(vor, ende, burst !== null && t > M.einsatz + 0.2 ? 0.35 : 0);
    // Snare: Ruck zur Seite als gedämpfte Schwingung (etwa 16 pro Sekunde), dazu Risse und die rote Lage.
    // Der Kick lässt das Logo nur noch leicht wachsen, damit das sichtbare Wackeln allein der Snare gehört.
    var schub = wackel * 0.022 * Math.cos(wackelSeit * 100);
    aufDieBuehne(t, {
      riss: Math.max(s, wackel * 0.5), roll: vor * vor * 0.9 + ende * 0.35 * Math.sin(t * 9), schub: schub,
      rot: kick * 0.006 + wackel * 0.034 + s * 0.03, schnee: Math.max(vor * 0.6, ende), alpha: blende, ky: 1, kx: 1
    });
  }

  // ── Stil „pegel“ ─────────────────────────────────────────────────
  function stilPegel(t, live) {
    var g = geo, m = g.W / 2;
    zeilenbild({ zeile: function (r, deck) {
      var b = bandDerZeile(r), hell = stand[b] * m, hoechst = Math.max(hell, spitze[b] * m);
      deck(0, m - hoechst, 0.11); deck(m + hoechst, g.W, 0.11);          // außen: feine Linie
      deck(m - hoechst, m - hell, 0.42); deck(m + hell, m + hoechst, 0.42);   // Spitzenwert hält
      deck(m - hell, m + hell, 0.86);                                    // innen: satter Balken
    } });
    var s = live ? Math.max(huelle(t, M.einsatz - 0.1, 0.08, 0, 0.1), huelle(t, M.schluss, 0.02, 0.06, 0.12)) : 0;
    aufDieBuehne(t, { riss: s * 0.6, roll: 0, rot: kick * 0.016 + s * 0.02, schnee: 0, alpha: blende, ky: 1, kx: 1 });
  }

  // ── Stil „testbild“ ──────────────────────────────────────────────
  var STUFEN = [1, 0.84, 0.69, 0.55, 0.42, 0.3, 0.2, 0.11], ROT = 5;      // Graustufen des Testbilds, Balken 6 rostrot
  function stilTestbild(t, live) {
    var g = geo, test = !live || t < M.einsatz || t >= M.schluss, bw = g.W / 8;
    zeilenbild({
      faerbe: function (x) {                                             // Balken über das Logo legen (nur wo Logo ist)
        x.globalCompositeOperation = 'source-atop';
        for (var c = 0; c < 8; c++) {
          var hell = test ? STUFEN[c] : Math.min(1, 0.1 + 1.2 * Math.pow(mittel(stand, c * 4, c * 4 + 4), 0.7));
          if (test && c === ROT) { x.fillStyle = AKZENT; x.globalAlpha = 1; }
          else { x.fillStyle = BG; x.globalAlpha = 1 - hell; }
          x.fillRect(Math.round(c * bw), 0, Math.ceil(bw), g.H);
        }
        x.globalAlpha = 1;
      },
      zeile: function (r, deck) { deck(0, g.W, 0.7); }                   // gleichmäßige Bildzeilen
    });
    var vor = live ? huelle(t, M.fill, M.einsatz - M.fill - 0.03, 0, 0.05) : 0;
    // Röhre aus: 0,22 s Testbild, dann in 0,2 s zum Strich, dann zieht sich der Strich zum Punkt zusammen
    var d = live ? t - M.schluss - 0.22 : 9, ky = 1, kx = 1, alpha = blende;
    if (d > 0) { ky = Math.max(0, 1 - d / 0.2); ky = ky * ky; }
    if (d > 0.2) { kx = Math.max(0, 1 - (d - 0.2) / 0.3); alpha = blende * Math.min(1, kx * 3); }
    if (!live) alpha = 0;                                                // danach kommt nur noch das normale Logo
    aufDieBuehne(t, { riss: vor * 0.5, roll: vor * 1.6, rot: 0, schnee: vor * 0.3, alpha: alpha, ky: ky, kx: kx });
  }

  // ── Ein Bild ─────────────────────────────────────────────────────
  function zeichne(t, dt, live) {
    miss(t, dt, live);
    ctx.clearRect(0, 0, geo.w, geo.h);
    if (STIL === 'pegel') stilPegel(t, live);
    else if (STIL === 'testbild') stilTestbild(t, live);
    else if (STIL === 'stoerung') stilStoerung(t, live);
    else if (live && t >= M.einsatz && t < M.schluss) stilStoerung(t, true);   // mix: im Song Störung
    else stilTestbild(t, live);                                           // mix: Anfang und Schluss Testbild
    if (blende < 1) {
      // Das normale Logo taucht auf: erst zart, dann kräftiger (Kurve statt gerader Linie).
      var sichtbar = Math.pow(1 - blende, 1.8);
      // Beim Wiederauftauchen zwei kurze Glitches (je etwa 70 ms), wie das Logo im Startbereich sonst auch glitcht
      var glitch = !live && ((blende < 0.46 && blende > 0.41) || (blende < 0.2 && blende > 0.16));
      if (glitch) {
        var x = hilf.a.getContext('2d');
        x.globalCompositeOperation = 'source-over';
        x.clearRect(0, 0, geo.W, geo.H);
        x.drawImage(logo, 0, 0, geo.W, geo.H);
        aufDieBuehne(t + (blende > 0.3 ? 1 : 2), { riss: 0.7, roll: 0, rot: 0.02, schnee: 0, alpha: sichtbar, ky: 1, kx: 1 });
      } else {
        ctx.globalAlpha = sichtbar;
        ctx.drawImage(logo, geo.lx, geo.ly, geo.lw, geo.lh);
        ctx.globalAlpha = 1;
      }
    }
    // Licht des Startbereichs geht mit (nur schreiben, wenn es sich sichtbar ändert)
    var vb = Math.round(kick * 25) / 25, vh = Math.round(Math.min(1, hoch) * 25) / 25;
    if (vb !== gesetztBass) { hero.style.setProperty('--eq-bass', vb); gesetztBass = vb; }
    if (vh !== gesetztHoch) { hero.style.setProperty('--eq-hoch', vh); gesetztHoch = vh; }
  }

  function bild(jetzt) {
    raf = 0;
    var dt = Math.min(0.1, (jetzt - letztes) / 1000 || 0.016);
    letztes = jetzt;
    if (an) {
      var t = songZeit(jetzt);
      blende = Math.min(1, t / 0.35);
      zeichne(t, dt, true);
      zeigeZeit(t);
    } else {
      // Zurück zum normalen Logo (nach echter Zeit, nicht nach gezählten Bildern: ein gedrosselter Tab bliebe hängen)
      blende = Math.max(0, Math.min(blende, (auslauf - jetzt) / AUSLAUF));
      zeichne(T.dauer, dt, false);
      if (jetzt >= auslauf) { raeumeAb(); return; }
    }
    if (imBild) raf = requestAnimationFrame(bild);
  }
  function starteBild() {
    if (raf || ruhig.matches || !imBild || (!an && !auslauf)) return;
    if (!hilf) hilf = { a: flaeche(4, 4), b: flaeche(4, 4) };
    if (!geo) vermesse();
    if (!hero.classList.contains('is-teaser')) {
      // Das <img> wird gleich unsichtbar. Sofort das Logo auf die Fläche legen, sonst fehlt es ein Bild lang.
      ctx.clearRect(0, 0, geo.w, geo.h);
      ctx.drawImage(logo, geo.lx, geo.ly, geo.lw, geo.lh);
      hero.classList.add('is-teaser');
    }
    letztes = performance.now();
    raf = requestAnimationFrame(bild);
  }
  function raeumeAb() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; auslauf = 0; blende = 0;
    hero.classList.remove('is-teaser');
    hero.style.removeProperty('--eq-bass');
    hero.style.removeProperty('--eq-hoch');
    gesetztBass = gesetztHoch = -1;
    for (var b = 0; b < B; b++) stand[b] = spitze[b] = halt[b] = 0;
    kick = 0; wackel = 0; snareNr = 0;
  }

  // ── Bedienung ────────────────────────────────────────────────────
  function setze(zustand) {
    an = zustand;
    knopf.setAttribute('aria-pressed', an ? 'true' : 'false');
    root.classList.toggle('is-an', an);
    if (fehler) fehler.hidden = true;
    zeigeZeit();
    zeigeMini();
    if (an) starteBild();
    else if (hero.classList.contains('is-teaser')) {
      auslauf = performance.now() + AUSLAUF;
      if (!imBild) raeumeAb(); else if (!raf) raf = requestAnimationFrame(bild);
    }
  }
  function einschalten() {
    if (!audio.getAttribute('src')) audio.src = tonUrl;   // Ton lädt erst jetzt
    try { audio.currentTime = 0; } catch (e) {}
    letzteC = -1;
    setze(true);
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setze(false); if (fehler) fehler.hidden = false; });
  }
  function ausschalten() { audio.pause(); setze(false); }
  function zeigeMini() { if (mini) mini.hidden = !(an && !knopfImBild); }

  knopf.addEventListener('click', function () { an ? ausschalten() : einschalten(); });
  if (mini) mini.querySelector('button').addEventListener('click', ausschalten);
  audio.addEventListener('timeupdate', function () { zeigeZeit(); });
  audio.addEventListener('ended', function () { setze(false); });
  audio.addEventListener('error', function () { if (an) { setze(false); if (fehler) fehler.hidden = false; } });

  // Zeichnen nur, solange der Startbereich im Bild ist. Der Ton läuft weiter.
  // Die kleine Leiste erscheint, sobald der Knopf selbst nicht mehr zu sehen ist.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      imBild = e[0].isIntersecting;
      if (imBild) starteBild();
      else if (!an && auslauf) raeumeAb();
    }, { threshold: 0.05 }).observe(hero);
    new IntersectionObserver(function (e) {
      knopfImBild = e[0].isIntersecting;
      zeigeMini();
    }, { threshold: 0.5 }).observe(knopf);
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { if (geo) vermesse(); }).observe(logo);
  } else {
    window.addEventListener('resize', function () { if (geo) vermesse(); });
  }
  // Wechselt jemand im laufenden Betrieb auf „Bewegung reduzieren“: Bild weg, Ton bleibt
  var beiRuhig = function () { if (ruhig.matches) raeumeAb(); else starteBild(); };
  if (ruhig.addEventListener) ruhig.addEventListener('change', beiRuhig); else if (ruhig.addListener) ruhig.addListener(beiRuhig);

  zeigeZeit();
})();
