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
  {
    datum: "2024-09-07",
    ort: "Wassenrock Open Air Festival",
    stadt: "Wassenberg",
    info: "https://www.wassenrock.de"
  },
  {
    // aus dem Videonamen „Nofunkshun MUBU2019“ – genaues Datum nachtragen
    datum: "2019",
    ort: "Musikbunker Aachen",
    stadt: "Aachen"
  },

  // ── Vergangene Gigs zum Nachtragen ──────────────────────────────
  // Einfach die Zeile kopieren, // vorne entfernen und ausfüllen:
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
  // { datum: "JJJJ-MM-TT", ort: "", stadt: "" },
];
