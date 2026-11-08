# nofunkshun – Band-Landingpage

Diese CLAUDE.md gilt für diesen Ordner. Die CLAUDE.md in `~/Downloads` (amtec Type-K-Videos) gilt hier **nicht**.

## Ziel
Eine einseitige Landingpage für die Band „nofunkshun“: wer die Band ist, wie sie klingt, wo man sie hört und sieht, wann sie spielt und wie man sie bucht.

## Regeln
- Inhalte nur aus Thomas' Angaben. Keine erfundenen Mitglieder, Termine, Zitate, Pressestimmen, Follower-Zahlen oder Links.
- Fehlt etwas, steht im Entwurf ein klar erkennbarer Platzhalter (`[…]`), kein ausgedachter Text.
- Keine fremden Logos oder Markennamen erfinden. Plattform-Links (Spotify, Bandcamp …) als schlichte Textlinks bzw. eigene neutrale Icons.
- Fotos und Logo nur aus den Quellen, die Thomas nennt. Originale bleiben, wo sie sind; Kopien für die Seite liegen verkleinert in `assets/`.

## Design-System
Verbindliche Quelle für Farben, Schrift, Abstände, Bauteile und Bildsprache: **Nofunkshun Design System** https://claude.ai/artifact/R4JMHWAvCYierNeu9i2Ws5 (Artifact, privat). Vor jeder Gestaltungsänderung dort `project/README.md` lesen; neue Werte zuerst dort eintragen, dann in der Seite verwenden.

## Technik
- Statische Seite: `index.html`, `styles.css`, optional ein kleines `script.js`. Keine Build-Kette, keine Frameworks, keine externen Tracker.
- Mobil zuerst, dann Desktop. Hell/dunkel nach Stil der Band, nicht nach Systemvorgabe, wenn Thomas nichts anderes sagt.
- Schriften lokal in `assets/fonts/` (kein Google-Fonts-Abruf → DSGVO).
- Vorschau: `.claude/launch.json` → `python3 -m http.server` in diesem Ordner.
- Hosting: GitHub Pages unter dem Account `daddytomsen`, sofern Thomas nichts anderes sagt. Push nur auf Wunsch.
- Impressum/Datenschutz: in Deutschland für eine öffentliche Band-Seite nötig. Inhalte dafür nur von Thomas.

## Arbeitsweise
- Thomas: du, Deutsch, vollständige Dateien statt Diffs, Entscheidungen selbst treffen und begründen.
- Stand und offene Punkte in `STAND.md` pflegen.
