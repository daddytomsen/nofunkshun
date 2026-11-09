# Stand – nofunkshun-website

**09.11.2026 · ONLINE UNTER https://nofunkshun.de** (DNS bei INWX, `CNAME` im Repo, HTTPS erzwungen, Zertifikat für nofunkshun.de + www bis 07.02.2027, verlängert GitHub selbst; www und die alte github.io-Adresse leiten auf nofunkshun.de um). Domain im GitHub-Konto verifiziert (09.11.2026, TXT `_github-pages-challenge-daddytomsen` bei INWX – **dauerhaft stehen lassen**).

**08.11.2026 · ONLINE: https://daddytomsen.github.io/nofunkshun/** (Repo daddytomsen/nofunkshun, öffentlich, Pages aus `main` /root, HTTPS an). Spotify-Player live geprüft. Domain nofunkshun.de am 08.11.2026 gekauft (INWX). Datei `CNAME` liegt lokal, **noch nicht gepusht**: erst wenn die DNS-Einträge bei INWX stehen und auflösen, sonst leitet github.io auf eine tote Adresse um.

**09.11.2026 · Start ohne Foto (lokal, noch nicht hochgeladen):** Startfoto auf Thomas' Wunsch vorerst raus, weil am **Sa 14.11.2026 ein Fotoshooting** ist und danach neue Fotos kommen. Start zeigt nur das Logo, groß und mittig (bis 640 px statt 330 px, neue scharfe Fassung `logo-1400.webp` aus dem Band-Original, in derselben hellen Farbe wie `logo.webp`). `hero-hoch.webp`/`hero-quer.webp` liegen noch in `assets/img`, werden aber nicht mehr verwendet. Bühnenfoto vor „Band“ ist jetzt Thomas' Auswahl Wassenrock 0022 (Banner + alle fünf); 0047 rückt dafür in der Galerie an die erste Stelle. Auf dem Handy ist das Bühnenfoto flacher und zoomt nicht, damit Sänger und Gitarrist am Rand bleiben. og:image = 0022. Danach: Domain einrichten.

**09.11.2026 · Logo-Glitch (lokal):** Thomas hat aus drei Testvarianten (Glitch / Verzerren / Scharfstellen) den **Glitch** gewählt, mit Wiederholung etwa alle 5 s. Umsetzung nur CSS: zwei Kopien des Logos (rot `--accent` und hell `--ink`, Logo als Maske) springen 0,75 s in Streifen versetzt, das Logo zuckt mit, danach 4,25 s Ruhe, endlos; erster Glitch 1,3 s nach dem Laden (nach dem Einblenden). `script.js` pausiert ihn, solange der Startbereich nicht zu sehen ist. Bei „Bewegung reduzieren“ steht das Logo still. Ins Design-System übernehmen (Bauteil Logo/Hero).

**09.11.2026 · Laufband ganz sichtbar + düsterer Start (lokal):** Das Laufband war nie ganz zu sehen (eine Zeile „Post-Rock · Stoner · Metal · Aachen“ ist in Grunge ~40 em breit, bei 66 px also ~2.700 px). Jetzt einmal statt dreimal, Schriftgröße aus der Breite gerechnet (Container-Einheit `cqi`, Desktop Breite/42, Handy zwei Zeilen Breite/25); beide Hälften gleiten beim Scrollen von links und rechts herein und stehen ab der Bildschirmmitte still. Start düsterer, Layout unverändert: kalter Lichtkegel von oben + dunkle Ecken (`.hero::before`), der bei jedem Logo-Glitch mitflackert; schwache rote Glut tief hinter dem Logo, die langsam atmet (`.hero::after`). Pause außerhalb der Sicht jetzt per `.hero.is-still`. Ins Design-System übernehmen.

**09.11.2026 · Neue Bio + Foto 0053 raus (lokal):** Bio durch Thomas' neue Fassung ersetzt (aus PDF kopiert: Ligaturfehler ti/ft/tt/fk korrigiert, Grammatik geglättet, Inhalt unverändert), EN neu übersetzt. Der Satz „Massiver Sound … ins Mark geht“ ist als hervorgehobener Absatz gesetzt. Weggelassen: der Satz „Nofunkshun, das sind: …“ (steht schon als Mitgliederliste daneben, Namen identisch) und das abgerissene Bruchstück „hypnotischem Stoner-Vibe. Kein“ – Thomas hat entschieden: „Massiver Sound zwischen treibendem Metal und hypnotischem Stoner-Vibe. Kein Firlefanz …“ (nicht „Metal und Funk“). Galerie: Schlagzeug-Nahaufnahme 0053 auf Thomas' Wunsch raus (Datei gelöscht, Original auf der Transcend), 0012 und 0081 jetzt breite Kacheln, Reihenfolge so, dass Desktop (4 Spalten) und Handy (2 Spalten) ohne Lücke aufgehen.

**09.11.2026 · Überschriften ruhiger (lokal):** Thomas fand die Abschnittstitel zu dominant. Titel jetzt höchstens 58 px statt 96 px (Handy ~31 statt ~43 px), mit rotem Nachglühen (`text-shadow` in `--accent`, drei Stufen) passend zur Glut hinter dem Logo; der Freilege-Effekt lässt unten Platz für das Glühen. Gig-Ort 21 statt 19 px, Gig-Zeile 16 statt 15 px. Ins Design-System übernehmen (Typo-Skala).

**08.11.2026 nachmittags · Design-System angelegt:** https://claude.ai/artifact/R4JMHWAvCYierNeu9i2Ws5 (Tokens aus styles.css, Grunge-Schrift, 12 Bauteile, Logos/Artwork/Fotos). Die Website nutzt es noch nicht direkt: Variablennamen weichen ab (`--display` statt `--font-display` usw.), und der Hover des gefüllten Buttons zeigt `ink` auf `accent` (3,55:1) statt `bg` auf `accent`.

**08.11.2026 abends · Fotos und Start überarbeitet (lokal, noch nicht hochgeladen):** Galerie durch 12 Wassenrock-2024-Fotos ersetzt (Gruppe + jedes Mitglied einzeln, als Schwarz-Weiß gespeichert, Nennung „Fotos: Armin Zedler“ unter der Galerie). Start-Foto zeigt jetzt alle fünf (Handy: neuer Zuschnitt aus DSC00787; Desktop: Foto wird nicht mehr seitlich beschnitten, Logo sitzt tiefer und kleiner). Claim „Musik soll man nicht nur hören …“ auf Thomas' Wunsch entfernt. **Design-System nachziehen:** Hero ohne Claim, Galerie-Fotos ohne Farbe beim Drüberfahren, Logo im Hero 330 px unten statt 460 px mittig.

**08.11.2026 spät · Handy-Start neu (lokal):** Start-Foto ohne Kante (unscharfer Hintergrund aus demselben Foto, Ränder laufen weich aus, langsamer Zoom), Kopfleiste scrollt auf dem Handy weg statt mitzulaufen, „Nächster Gig“ als kompakte Zeile statt Riesen-Button, Inhalte blenden beim Scrollen sanft ein (nicht bei „Bewegung reduzieren“), CSS/JS mit Versionsnummer gegen alten Browser-Cache. Ins Design-System übernehmen.

**08.11.2026 nachts · Scroll-Bewegung (lokal):** Start löst sich beim Scrollen auf (Foto sinkt, Schrift steigt), Titel werden von links freigelegt + roter Balken wächst, Inhalte gleiten herein, EP-Cover kippt gerade, Galerie-Kacheln wachsen herein mit Tiefe im Foto, Genre-Laufband (zwei Zeilen gegeneinander) nach „Live“, Bühnenfoto mit Tiefe (Wassenrock 0047) vor „Band“, rote Fortschrittslinie oben, weiche Überblendung beim Sprachwechsel und zum Impressum. Alles CSS-Scroll-Animationen (Safari 26+, Chrome), Firefox bekommt nur das einfache Einblenden per JS; bei „Bewegung reduzieren“ bleibt alles still. Ins Design-System übernehmen (Abschnitt Bewegung ist damit überholt).

**Stolpersteine Safari (gefunden mit WebKit 26 über Playwright, 08.11.2026):**
- `body { overflow-x: hidden }` macht body in Safari zum eigenen Scroll-Bereich → alle Scroll-Animationen hingen fest. Nie overflow auf body; Abschneiden nur mit `overflow: clip` (erzeugt keinen Scroll-Bereich).
- Grunge zeichnet Großbuchstaben bis 2,07 em über der Grundlinie bei Zeilenhöhe 1 → ragt fast eine Zeile über ihren Kasten. Alles, was Grunge beschneidet (overflow, clip-path), braucht oben viel Luft (Titel: clip-path oben −150 %, Laufband: Zeilenhöhe 2,3 + Polster).
- Prüfen in WebKit: `scratchpad/wk` (Playwright, Browser im Ordner `browsers`, Start außerhalb der Sandbox).

## Was drin ist
- `index.html` – eine Seite: Start (Logo, Claim, Spotify, nächster Gig) · Live · Musik (Black Moon EP, Spotify-Player per Zwei-Klick, Teaser-Video) · Band (Bio + Besetzung) · Fotos · Kontakt
- DE/EN-Umschalter (merkt sich die Wahl; Erstwahl nach Browsersprache)
- `gigs.js` – **alle Termine an einer Stelle.** Kommende landen automatisch unter „Live“, vergangene unter „Vergangene Gigs“. Vorlage zum Nachtragen steht in der Datei.
- `impressum.html` – Impressum + Datenschutz (Entwurf)
- `assets/` – verkleinerte Kopien aus `iCloud/Desktop/NoFunkShun` (Originale unangetastet)

## Quellen
| Inhalt | Quelle |
|---|---|
| Bio, Besetzung | `Bio Nofunkshun.docx` (sprachlich gestrafft, EN übersetzt, nichts ergänzt) |
| Logo, Black-Moon-Logo, Cover | `Art-Work/` (Logo für dunklen Grund weiß umgefärbt) |
| Start-Foto | `Bandfotos/` DSC00787 (mobil, Zuschnitt mit allen fünf), DSC00782 (Desktop) |
| Galerie | `/Volumes/Transcend/Nofunkshun/Nofunkshun/Wassernrock 07.09.24 3000 NoFunkshun/` Nr. 0022, 0004, 0090, 0016, 0012, 0053, 0074, 0028, 0047, 0042, 0081, 0025 – Fotograf Armin Zedler (Wasserzeichen bleibt drin) |
| Teaser | `Videos/Nofunkshun Black Moon Teaser 2021 Kopie.mp4` → 720p, 8,7 MB |
| Schrift Überschriften | `Art-Work/grunge.ttf` |
| Tracklist EP | Dateinamen in `Album_Black Moon/` |
| Gig 29.01.2027 | mubu.ac/event/7391 |
| Wassenrock 07.09.2024 | Plakat `Wassenrock24/` |
| MUBU 2019 | nur Videoname `Nofunkshun MUBU2019.mp4` – Datum fehlt |

Bewusst **nicht** verwendet: Fotos mit „Bruises“-Banner (fremde Band), Wassenrock-Plakate (Sponsorenlogos), TMSTR-Logo, Video „amtec silence“, Audio-Rohspuren und Cubase-Projekte.

## Offen (von Thomas)
1. ~~Impressum-Anschrift~~ – erledigt 08.11.2026.
2. ~~Schrift grunge.ttf~~ – laut Thomas die eigene Schrift der Band, darf verwendet werden. Hat keine Umlaute → nur für Überschriften ohne ä/ö/ü.
3. **YouTube:** Kanal existiert offenbar (Screenshot im Artwork), Link fehlt.
4. **Vergangene Gigs** in `gigs.js` nachtragen; Datum MUBU 2019.
5. Wer ist auf welchem Foto? (Dann wären Einzelfotos bei der Besetzung möglich.)
6. Fotograf/in der Proberaum-Bandfotos (Start-Foto) nennen? Für die Wassenrock-Fotos steht Armin Zedler drin – passt die Nutzung mit ihm so?
7. ~~„KONTAKT“ brach um (T in zweiter Zeile)~~ – behoben 08.11.2026: Abschnittstitel bleiben einzeilig und verkleinern sich nach Wortbreite (`--title-em`, Standard 8,9 em, Kontakt 11 em). Ins Design-System übernehmen.

## Vorschau lokal
Vorschau-Server „nofunkshun“ (Port 8798) liest aus einem Scratchpad-Spiegel, weil der Server `~/Downloads` nicht lesen darf. Nach Änderungen: `rsync -a --delete --exclude .claude ~/Downloads/nofunkshun-website/ <spiegel>/`.

## Online-Weg (GitHub Pages, Account daddytomsen)
1. Repo `daddytomsen/nofunkshun` anlegen (öffentlich; Pages ist bei privaten Repos nur mit Bezahl-Abo möglich).
2. Ordnerinhalt pushen (ohne `entwurf-screens/` und `.claude/`).
3. Settings → Pages → „Deploy from branch“, `main`, `/ (root)`.
4. Adresse: `https://daddytomsen.github.io/nofunkshun/`
5. Später eigene Domain: im Repo Datei `CNAME` mit `nofunkshun.de`, beim Domain-Anbieter DNS-Einträge auf GitHub (4 A-Records + `www` als CNAME auf `daddytomsen.github.io`), dann „Enforce HTTPS“. Kostet bei GitHub nichts.

## Domain nofunkshun.de (gekauft 08.11.2026, INWX)
Reihenfolge, damit die Seite nie offline ist:
1. INWX → Domain → DNS: A-Records für `@` auf 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; AAAA für `@` auf 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153; `www` als CNAME auf `daddytomsen.github.io`. Vorhandene Parking-Einträge für `@`/`www` löschen.
2. Prüfen, dass nofunkshun.de auf GitHub zeigt.
3. Datei `CNAME` (Inhalt `nofunkshun.de`) pushen → GitHub Pages übernimmt die Domain, github.io-Adresse leitet um.
4. Wenn das Zertifikat da ist (bis ~1 h): Settings → Pages → „Enforce HTTPS“.
5. Empfohlen: Domain im GitHub-Konto verifizieren (Settings → Pages → Add a domain → TXT-Eintrag bei INWX), damit niemand anderes sie auf GitHub belegen kann.

## Domains (geprüft 08.11.2026 per DNS: alle nicht registriert)
nofunkshun.de · .com · .net · .eu · .nl · .band · .rocks · .music
