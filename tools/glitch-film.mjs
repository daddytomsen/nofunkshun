#!/usr/bin/env node
/* Filmt den Startbereich der Website (Logo-Glitch mit Bandfoto) Bild für Bild ab -> MP4 ohne Ton.

   Wozu: Thomas möchte den Glitch der Band zeigen; eine HTML-Seite lässt sich auf dem Handy nicht einfach
   weitergeben, ein Video schon.

   Wie: Chrome läuft ohne Fenster und wird über das DevTools-Protokoll gesteuert (über eine Pipe, kein
   Netzwerk-Port; Muster: nofunkshun-video/scripts/web_film.mjs). Alle CSS-Animationen mit Zeitachse
   werden angehalten und für jedes Bild auf genau t = Bild / fps gesetzt. So ist jedes Bild exakt und
   nichts ruckelt, egal wie lange ein Bildschirmfoto dauert.

   Aufruf (außerhalb der Claude-Sandbox, Vorschau-Server muss laufen):
     node tools/glitch-film.mjs handy|desktop [--sekunden=11.5] [--url=http://localhost:8798/] [--aus=ordner]
*/
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FF = '/opt/homebrew/bin/ffmpeg';
const FORMATE = {
  handy:   { width: 540,  height: 960, deviceScaleFactor: 2,   mobile: true  },   // -> 1080 x 1920
  desktop: { width: 1280, height: 720, deviceScaleFactor: 1.5, mobile: false },   // -> 1920 x 1080
};
const wert = (n, d) => { const a = process.argv.find(x => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : d; };
const name = process.argv[2] || 'handy';
const format = FORMATE[name];
if (!format) { console.error('handy oder desktop'); process.exit(1); }
const FPS = 30;
const SEK = Number(wert('sekunden', 11.5));
const URL_ = wert('url', 'http://localhost:8798/');
const AUS = wert('aus', path.join(process.env.HOME, 'Downloads', 'nofunkshun-video', 'preview'));
const bilder = path.join(tmpdir(), 'nfs-glitch-film-' + name);
rmSync(bilder, { recursive: true, force: true });
mkdirSync(bilder, { recursive: true });
mkdirSync(AUS, { recursive: true });

// Vor den Skripten der Seite: deutsch
const VORAB = `try { localStorage.setItem('nfs-lang', 'de'); } catch (e) {}`;

// Nach dem Laden: Übergänge aus, Schriften und Bilder abwarten, Uhr-Funktion anlegen
const VORBEREITEN = `(async () => {
  const st = document.createElement('style');
  st.textContent = '*, *::before, *::after { transition: none !important; } html { scroll-behavior: auto !important; } .to-top { display: none !important; }';
  document.head.appendChild(st);
  await document.fonts.ready;
  await document.querySelector('.hero__logo img').decode();
  await new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = 'assets/img/band-glitch.webp'; });
  const echtRaf = window.requestAnimationFrame.bind(window);
  window.__setze = async (ms) => {
    document.getAnimations().forEach(a => {
      if (!(a.timeline instanceof DocumentTimeline)) return;   // Scroll-Animationen bleiben, wie sie sind
      a.pause(); a.currentTime = ms;
    });
    await new Promise(r => echtRaf(() => echtRaf(r)));          // zwei echte Bilder: alles gemalt
  };
  return document.getAnimations().map(a => a.animationName).filter(Boolean).join(',');
})()`;

const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-pipe', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--mute-audio', '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=' + path.join(tmpdir(), 'nfs-glitch-profil-' + name), 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
let fehlertext = '', fertig = false;
chrome.stderr.on('data', d => { fehlertext += d; });
chrome.on('exit', c => { if (!fertig) { console.error('Chrome ist vorzeitig beendet (Code ' + c + '). In der Claude-Sandbox startet Chrome nicht.\n' + fehlertext.slice(-1200)); process.exit(2); } });
let nr = 0, puffer = Buffer.alloc(0);
const offen = new Map(), ereignisse = [];
chrome.stdio[4].on('data', d => {
  puffer = Buffer.concat([puffer, d]);
  let i;
  while ((i = puffer.indexOf(0)) >= 0) {
    const m = JSON.parse(puffer.subarray(0, i).toString());
    puffer = puffer.subarray(i + 1);
    if (m.id && offen.has(m.id)) { const { ja, nein } = offen.get(m.id); offen.delete(m.id); m.error ? nein(new Error(m.error.message)) : ja(m.result); }
    else if (m.method) ereignisse.forEach(f => f(m));
  }
});
const sende = (method, params = {}, sessionId) => {
  const id = ++nr;
  chrome.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
  return new Promise((ja, nein) => offen.set(id, { ja, nein }));
};
const warteAuf = method => new Promise(ja => { const f = m => { if (m.method === method) { ereignisse.splice(ereignisse.indexOf(f), 1); ja(m); } }; ereignisse.push(f); });
const zeitlimit = setTimeout(() => { console.error('Chrome antwortet nicht.\n' + fehlertext.slice(-1500)); chrome.kill(); process.exit(2); }, 300000);

try {
  const { targetInfos } = await sende('Target.getTargets');
  const ziel = targetInfos.find(t => t.type === 'page');
  const { sessionId: s } = await sende('Target.attachToTarget', { targetId: ziel.targetId, flatten: true });
  const js = async (expression) => {
    const r = await sende('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, s);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await sende('Emulation.setDeviceMetricsOverride', format, s);
  await sende('Network.enable', {}, s);
  await sende('Network.setCacheDisabled', { cacheDisabled: true }, s);
  await sende('Page.enable', {}, s);
  await sende('Page.addScriptToEvaluateOnNewDocument', { source: VORAB }, s);
  const geladen = warteAuf('Page.loadEventFired');
  await sende('Page.navigate', { url: URL_ + '?film=' + Date.now() }, s);
  await geladen;
  console.log('Animationen:', await js(VORBEREITEN));
  const gesamt = Math.round(SEK * FPS);
  for (let i = 0; i < gesamt; i++) {
    await js(`__setze(${(i * 1000 / FPS).toFixed(3)})`);
    const { data } = await sende('Page.captureScreenshot', { format: 'jpeg', quality: 93 }, s);
    writeFileSync(path.join(bilder, 'b' + String(i).padStart(5, '0') + '.jpg'), Buffer.from(data, 'base64'));
    if (i % 60 === 0) console.log('Bild', i, '/', gesamt);
  }
  fertig = true;
  await sende('Browser.close').catch(() => {});
} finally {
  fertig = true;
  clearTimeout(zeitlimit);
  chrome.kill();
}

const aus = path.join(AUS, 'nofunkshun_logo-glitch_bandfoto_' + name + '.mp4');
const r = spawnSync(FF, ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(bilder, 'b%05d.jpg'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', aus], { encoding: 'utf8' });
if (r.status) { console.error(r.stderr); process.exit(3); }
console.log('Fertig:', aus);
