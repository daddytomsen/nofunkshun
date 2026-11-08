# Stand – nofunkshun-website

**08.11.2026 · Erster Entwurf läuft lokal, von Thomas abgenommen. Noch nicht online (Impressum-Anschrift fehlt, Push nur auf Wunsch).**

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
| Fotos | `Bandfotos/` DSC00787 (Start mobil), DSC00782 (Start Desktop), 00810, 00880, 00905, 00939, 00917, 00893, 00815, 00907 |
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
6. Fotograf/in der Bandfotos nennen?

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
