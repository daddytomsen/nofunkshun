/*
  GIGS – hier pflegst du alle Auftritte. Die Seite sortiert selbst:
  alles ab heute erscheint unter „Live“, alles davor unter „Vergangene Gigs“.

  Ein Eintrag sieht so aus (alles außer datum und ort ist freiwillig):

  {
    datum:   "2027-01-29",          // JJJJ-MM-TT; kennst du nur Jahr oder Monat: "2019" oder "2019-05"
    beginn:  "20:00",               // Uhrzeit Beginn
    einlass: "19:00",               // Uhrzeit Einlass
    ort:     "Musikbunker Aachen",  // Club, Kneipe, Festival …
    stadt:   "Aachen",
    de:      "Special Guest bei Transpunk",   // kurzer Zusatz auf Deutsch
    en:      "Special guest of Transpunk",    // derselbe Zusatz auf Englisch
    preis:   "VVK 17,50 € zzgl. Geb. · AK 22 €",
    info:    "https://…",           // Link zur Veranstaltung
    tickets: "https://…"            // Link zum Ticketkauf
  },

  Nach jedem Eintrag ein Komma. Reihenfolge egal.
*/

window.GIGS = [
  {
    datum: "2027-01-29",
    beginn: "20:00",
    einlass: "19:00",
    ort: "Musikbunker Aachen",
    stadt: "Aachen",
    de: "Special Guest bei Transpunk",
    en: "Special guest of Transpunk",
    preis: "VVK 17,50 € zzgl. Geb. · AK 22 €",
    info: "https://mubu.ac/event/7391/",
    tickets: "https://musikbunkeraachen.bigcartel.com/product/transpunk-290127"
  },
  // ── Vergangene Gigs (09.11.2026 von den Facebook-Veranstaltungen und Instagram der Band) ──
  { datum: "2026-09-05", ort: "Bürgerpark Kerpen-Sindorf", stadt: "Kerpen", de: "Musikinitiative Rhein-Erft e. V.", en: "Musikinitiative Rhein-Erft e. V.", info: "https://www.instagram.com/nofunkshun/p/DcWr0aRolyN/" },
  { datum: "2025-11-27", ort: "Sowiso Ocean", stadt: "Aachen", info: "https://www.facebook.com/events/683501664596335/" },
  { datum: "2024-09-07", ort: "Wassenrock Open Air Festival", stadt: "Wassenberg", info: "https://www.wassenrock.de" },
  { datum: "2024-04-20", ort: "Area 28", stadt: "Aachen", de: "25 Jahre Mafish, mit Bull", en: "25 years of Mafish, with Bull", info: "https://www.facebook.com/events/1124554395354501/" },
  { datum: "2023-07-14", ort: "Schneckes", stadt: "Eschweiler", info: "https://www.facebook.com/events/1231278927586330/" },
  { datum: "2023-01-20", ort: "FRANZ", stadt: "Aachen", de: "Crossing Styles mit Mafish und Sinfronteras", en: "Crossing Styles with Mafish and Sinfronteras", info: "https://www.facebook.com/events/675763777385373/" },
  { datum: "2019-07-05", ort: "Schneckes", stadt: "Eschweiler", de: "Release-Konzert EP „Black Moon“", en: "Release show for the EP “Black Moon”", info: "https://www.facebook.com/events/1368405676639795/" },
  { datum: "2019-04-26", ort: "Shamrock Irish Pub", stadt: "Maastricht", de: "mit Spoonfed", en: "with Spoonfed", info: "https://www.facebook.com/events/1014053682125238/" },
  { datum: "2019-03-22", ort: "Musikbunker Aachen", stadt: "Aachen", de: "mit Heller", en: "with Heller", info: "https://www.facebook.com/events/626586164425997/" },
  { datum: "2018-11-17", ort: "Schneckes", stadt: "Eschweiler", info: "https://www.facebook.com/events/545664159216105/" },
  { datum: "2018-09-29", ort: "Leyla's Café & Kultur", stadt: "Aachen", info: "https://www.facebook.com/events/687766254930977/" },
  { datum: "2018-09-08", ort: "The Wild Rover Irish Pub", stadt: "Aachen", info: "https://www.facebook.com/events/1812170575753209/" },
  { datum: "2018-04-28", ort: "Schlüsselloch Rockkneipe", stadt: "Aachen", info: "https://www.facebook.com/events/417052542074848/" },
  { datum: "2018-02-24", ort: "Kleiner Gürzenich", stadt: "Eschweiler", info: "https://www.facebook.com/events/1647657675294808/" },

  // ── Vergangene Gigs zum Nachtragen ──────────────────────────────
  // Einfach die Zeile kopieren, // vorne entfernen und ausfüllen:
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
];
