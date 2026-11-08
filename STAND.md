# Stand – nofunkshun-website

**08.11.2026 · ONLINE: https://daddytomsen.github.io/nofunkshun/** (Repo daddytomsen/nofunkshun, öffentlich, Pages aus `main` /root, HTTPS an). Spotify-Player live geprüft. Nächster Schritt: Domain nofunkshun.de bei INWX (Thomas bucht), dann CNAME + DNS.

**08.11.2026 nachmittags · Design-System angelegt:** https://claude.ai/artifact/R4JMHWAvCYierNeu9i2Ws5 (Tokens aus styles.css, Grunge-Schrift, 12 Bauteile, Logos/Artwork/Fotos). Die Website nutzt es noch nicht direkt: Variablennamen weichen ab (`--display` statt `--font-display` usw.), und der Hover des gefüllten Buttons zeigt `ink` auf `accent` (3,55:1) statt `bg` auf `accent`.

**08.11.2026 abends · Fotos und Start überarbeitet (lokal, noch nicht hochgeladen):** Galerie durch 12 Wassenrock-2024-Fotos ersetzt (Gruppe + jedes Mitglied einzeln, als Schwarz-Weiß gespeichert, Nennung „Fotos: Armin Zedler“ unter der Galerie). Start-Foto zeigt jetzt alle fünf (Handy: neuer Zuschnitt aus DSC00787; Desktop: Foto wird nicht mehr seitlich beschnitten, Logo sitzt tiefer und kleiner). Claim „Musik soll man nicht nur hören …“ auf Thomas' Wunsch entfernt. **Design-System nachziehen:** Hero ohne Claim, Galerie-Fotos ohne Farbe beim Drüberfahren, Logo im Hero 330 px unten statt 460 px mittig.

**08.11.2026 spät · Handy-Start neu (lokal):** Start-Foto ohne Kante (unscharfer Hintergrund aus demselben Foto, Ränder laufen weich aus, langsamer Zoom), Kopfleiste scrollt auf dem Handy weg statt mitzulaufen, „Nächster Gig“ als kompakte Zeile statt Riesen-Button, Inhalte blenden beim Scrollen sanft ein (nicht bei „Bewegung reduzieren“), CSS/JS mit Versionsnummer gegen alten Browser-Cache. Ins Design-System übernehmen.

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

## Domains (geprüft 08.11.2026 per DNS: alle nicht registriert)
nofunkshun.de · .com · .net · .eu · .nl · .band · .rocks · .music
