"""Abschnittstitel, die sich beim Scrollen schreiben.

Nimmt die Umrisse der Buchstaben aus der Grunge-Schrift und legt darüber
unsichtbare Pinselstriche in Schreibreihenfolge. Die Striche dienen als Maske:
Sie geben die echte Schrift beim Scrollen Stück für Stück frei.

Aufruf:  python3 tools/titel-schreiben.py [AUSGABEORDNER] [--einsetzen]
Ausgabe: titel.json (Wort -> SVG-Schnipsel) und titel-pruefung.html
         (je Wort: Schrift + Striche, um die Deckung zu prüfen).
--einsetzen ersetzt in index.html jedes vorhandene <svg class="write">
         (erkannt an der Masken-ID write-<wort>) durch die neue Fassung.
         Ein neues Wort muss einmal von Hand als Titel angelegt werden.

Koordinaten in Font-Einheiten je Buchstabe: x ab dem Buchstabenanfang,
y nach oben ab der Grundlinie, 2048 Einheiten = 1 em.
"""
import json, math, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '..', 'assets', 'fonts', 'grunge.ttf')
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = ARGS[0] if ARGS else '.'
INSERT = '--einsetzen' in sys.argv

UPM = 2048
BASE = 2252          # Grundlinie unter Zeilenoberkante (hhea-Maße, Mac/iOS): 1,0996 em
MASK_TOP, MASK_H = -4500, 5100   # Maskenfläche (Bildschirm-y), K und P ragen bis 4239 hinauf

WORDS = ['LIVE', 'MUSIK', 'MUSIC', 'BAND', 'FOTOS', 'PHOTOS', 'KONTAKT', 'CONTACT']

# Zeitachse je Titel (view-timeline --title): Schreiben von cover START bis END,
# kurze Pause bei jedem Absetzen des Pinsels.
START, END, LIFT = 4.0, 40.0, 0.3

# Alle Strichbreiten mal diesen Faktor: deckt die zerfransten Ränder besser ab,
# damit am Ende (write__done) kaum etwas nachgefüllt werden muss.
WIDEN = 1.2

# Striche je Buchstabe: (Breite, [(x, y), ...]) in Schreibreihenfolge.
STROKES = {
    'L': [
        (500, [(640, 3020), (565, 1900), (390, 900), (380, 600), (900, 610), (1700, 690), (2650, 860)]),  # Stamm + Balken
        (260, [(160, 220), (900, 330), (1950, 520)]),                                                    # Schwung
        (160, [(880, 1190), (1010, 1260)]),                                                              # Spritzer
    ],
    'I': [
        (560, [(317, 3330), (257, 1600), (207, 560)]),
        (110, [(317, 640), (337, 0)]),
    ],
    'V': [
        (720, [(180, 2650), (770, 1800), (1180, 1000), (1420, 300), (1770, 520), (2040, 1300), (2320, 2100), (2520, 2680)]),
    ],
    'E': [
        (520, [(1055, 3560), (855, 3060), (735, 2480), (615, 1700), (475, 1100), (305, 600), (185, 330)]),  # Stamm
        (220, [(35, 1560), (275, 1440), (455, 1350)]),                                                       # Schnörkel
        (480, [(805, 2790), (1755, 2920), (2675, 3060)]),                                                    # oberer Arm
        (420, [(805, 1900), (1655, 1930), (2305, 1880)]),                                                    # mittlerer Arm
        (380, [(605, 1380), (1155, 1520), (1605, 1640)]),                                                    # Bauch
        (640, [(705, 800), (1855, 900), (2915, 1060)]),                                                      # unterer Arm
    ],
    'M': [
        (200, [(150, 2700), (130, 1500), (200, 600), (270, 50)]),                                           # dünne Linie links
        (450, [(300, 2750), (420, 1500), (500, 400)]),                                                       # linker Stamm
        (460, [(650, 2650), (1000, 1400), (1250, 450), (1700, 1600), (2200, 2700), (2500, 3150),
               (2580, 1800), (2580, 500)]),                                                                  # Zickzack
        (380, [(2750, 1100), (2700, 150)]),                                                                  # Auslauf rechts
    ],
    'U': [
        (460, [(120, 2250), (150, 900), (500, 450), (950, 600), (1250, 300), (1300, 1400), (1330, 2500)]),
        (140, [(1620, 2350), (1620, 500)]),
    ],
    'S': [
        (650, [(2500, 2050), (2650, 2450), (2100, 2950), (1300, 3000), (750, 2550), (800, 1900), (1500, 1650),
               (2300, 1450), (2650, 1000), (2450, 500), (1700, 300), (900, 450), (650, 900), (1200, 900),
               (2000, 850)]),
        (200, [(2700, 3000), (1800, 3330), (700, 3200), (100, 2650), (400, 2300)]),                          # äußerer Schwung
    ],
    'K': [
        (300, [(50, 3150), (900, 3500), (1700, 3850)]),                                                      # Schwung oben
        (480, [(1800, 3950), (1500, 3000), (1250, 2200), (1050, 1200), (850, 300)]),                         # Stamm
        (400, [(1200, 1900), (2000, 2700), (3200, 3600)]),                                                   # oberer Arm
        (500, [(1300, 2250), (2200, 1700), (2900, 1000), (3250, 500)]),                                      # Bein
        (450, [(1200, 1700), (1500, 1300), (2100, 1000), (2800, 400), (3200, 0)]),                           # Bauch + Fuß
    ],
    'C': [
        (130, [(30, 2850), (60, 2700)]),                                                                     # Strichlein
        (600, [(2750, 2250), (2900, 2650), (2100, 2950), (1450, 2600), (1250, 1700), (1300, 900), (1800, 450),
               (2700, 750), (3150, 1000)]),
    ],
    'B': [
        (420, [(50, 1800), (600, 2050), (650, 1100), (650, 100)]),                                           # Schnörkel + Stamm
        (550, [(700, 1950), (1600, 2000), (2450, 1950), (2350, 1500), (1500, 1250), (900, 1150),
               (1800, 1050), (2600, 850), (1800, 600), (1000, 500), (800, 150)]),                            # beide Bäuche
    ],
    'A': [
        (480, [(1440, 3600), (1150, 2580), (750, 1000), (420, 250)]),                                        # linkes Bein
        (560, [(1450, 3600), (1620, 2580), (2150, 1000), (2750, 100)]),                                      # rechtes Bein
        (300, [(0, 1240), (1300, 1360), (2650, 1450)]),                                                      # Querstrich
        (220, [(800, 1100), (1700, 900), (2600, 600)]),                                                      # zweiter Querstrich
    ],
    'N': [
        (380, [(650, 2950), (600, 1700), (550, 550)]),
        (200, [(600, 1900), (400, 900), (100, 0)]),                                                          # Auslauf links
        (420, [(750, 2900), (1400, 1800), (2000, 700)]),
        (380, [(2050, 650), (2150, 2000), (2400, 3500)]),
        (250, [(2000, 3300), (1950, 2200)]),                                                                 # dünne Linie
        (180, [(2600, 3400), (2500, 2500)]),
    ],
    'D': [
        (420, [(380, 2450), (350, 1300), (400, 150)]),
        (480, [(450, 2350), (1300, 2300), (1900, 2100), (2250, 1600), (2150, 900), (1500, 350), (600, 150)]),
    ],
    'F': [
        (160, [(450, 3300), (250, 1800), (80, 30)]),                                                         # dünne Linie
        (550, [(1000, 3150), (800, 2200), (700, 1200), (600, 400)]),                                         # Stamm
        (500, [(900, 2750), (1900, 2550), (3100, 2750)]),                                                    # oberer Arm
        (480, [(800, 1700), (1700, 1750), (2500, 1850)]),                                                    # mittlerer Arm
    ],
    'O': [
        (560, [(2000, 3150), (1300, 3000), (1050, 2200), (1100, 1000), (1700, 400), (2400, 500),
               (2900, 1300), (2900, 2300), (2450, 2950), (1900, 3100)]),
        (300, [(1600, 3250), (700, 2600), (350, 1800), (450, 1000), (1100, 500)]),                           # äußerer Ring
        (200, [(2900, 2950), (3200, 2600), (3380, 2250)]),                                                   # Schwung rechts
    ],
    'T': [
        (600, [(0, 2200), (1200, 2150), (2000, 2150), (3050, 2150)]),                                        # Balken
        (480, [(1450, 3450), (1550, 2400), (1650, 1300), (1850, 300), (1950, 100)]),                         # Stamm
        (280, [(2150, 1300), (2250, 300)]),                                                                  # Auslauf
    ],
    'P': [
        (450, [(500, 4150), (550, 2500), (650, 100)]),
        (600, [(700, 3950), (1600, 3750), (2450, 3450), (2350, 2700), (1700, 2300), (900, 2300),
               (1000, 3000), (1900, 3100)]),
        (300, [(1100, 1700), (1300, 1300), (1900, 1000)]),
    ],
    'H': [
        (380, [(150, 2500), (600, 2950), (650, 1800), (650, 700)]),
        (250, [(500, 1400), (250, 1000), (300, 650)]),                                                       # Kringel unten
        (380, [(2150, 3330), (2100, 1800), (2050, 200)]),
        (380, [(150, 1250), (1000, 1450), (2050, 1650)]),
    ],
}

font = TTFont(FONT)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()


def plen(pts):
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


def path_d(pts, dx):
    return 'M' + ' L'.join(f'{x + dx:.0f} {-y:.0f}' for x, y in pts)


def build(word):
    """Liefert (Breite in Font-Einheiten, Umriss-Pfad, Striche [(Breite, Punkte, dx)])."""
    ink, strokes, x = [], [], 0
    for ch in word:
        g = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))   # y nach unten, Grundlinie 0
        ink.append(pen.getCommands())
        strokes += [(w, pts, x) for w, pts in STROKES[ch]]
        x += font['hmtx'][g][0]
    return x, ' '.join(ink), strokes


def svg_for(word):
    width, ink, strokes = build(word)
    lengths = [plen(p) for _, p, _ in strokes]
    span = END - START - LIFT * (len(strokes) - 1)
    t, paths = START, []
    for (w, pts, dx), L in zip(strokes, lengths):
        a, b = t, t + span * L / sum(lengths)
        t = b + LIFT
        paths.append(f'<path d="{path_d(pts, dx)}" stroke-width="{w * WIDEN:.0f}" pathLength="1" style="--a:{a:.1f}%;--b:{b:.1f}%"/>')
    mid = f'write-{word.lower()}'
    mx, mw = -400, width + 800
    return width, (
        f'<svg class="write" viewBox="0 {-BASE} {width} {UPM}" style="width:{width / UPM:.4f}em" aria-hidden="true" focusable="false">'
        f'<defs><mask id="{mid}" maskUnits="userSpaceOnUse" x="{mx}" y="{MASK_TOP}" width="{mw}" height="{MASK_H}">'
        f'<g class="write__pen" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">{"".join(paths)}</g>'
        f'<rect class="write__done" x="{mx}" y="{MASK_TOP}" width="{mw}" height="{MASK_H}" fill="#fff"/>'
        f'</mask></defs>'
        f'<path class="write__ink" mask="url(#{mid})" d="{ink}"/></svg>'
    )


result = {}
rows = []
for word in WORDS:
    width, svg = svg_for(word)
    result[word] = svg
    _, ink, strokes = build(word)
    dbg = ''.join(f'<path d="{path_d(p, dx)}" stroke-width="{w * WIDEN:.0f}"/>' for w, p, dx in strokes)
    rows.append(f'<div class="row"><svg viewBox="0 {-BASE} {width} {UPM}" style="width:{width / UPM:.4f}em">'
                f'<path class="ink" d="{ink}"/><g class="dbg">{dbg}</g></svg></div>')

with open(os.path.join(OUT, 'titel.json'), 'w') as f:
    json.dump(result, f, ensure_ascii=False, indent=1)

with open(os.path.join(OUT, 'titel-pruefung.html'), 'w') as f:
    f.write('<!doctype html><meta charset="utf-8"><style>'
            'body{margin:0;background:#0b0b0b;padding:120px 40px 40px;display:flex;flex-wrap:wrap;gap:150px 60px;width:1800px}'
            '.row{font-size:110px;height:1em}.row svg{height:1em;overflow:visible;display:block}'
            '.ink{fill:#ece7dd}.dbg path{fill:none;stroke:rgba(80,160,255,.5);stroke-linecap:round;stroke-linejoin:round}'
            '</style>' + ''.join(rows))

print({w: len(s) for w, s in result.items()})

if INSERT:
    import re
    page = os.path.join(HERE, '..', 'index.html')
    html = open(page, encoding='utf-8').read()

    def swap(m):
        lang, word = m.group(1), m.group(2).upper()
        new = result[word]
        return new.replace('<svg class="write"', f'<svg class="write"{lang}', 1) if lang else new

    html, n = re.subn(r'<svg class="write"( lang="[a-z]+")?[^>]*>.*?<mask id="write-([a-z]+)".*?</svg>',
                      swap, html, flags=re.S)
    open(page, 'w', encoding='utf-8').write(html)
    print('eingesetzt:', n)
