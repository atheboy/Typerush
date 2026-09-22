# TypeRush ⌨️

En interaktiv hurtigskrivingstest med statistikk i sanntid, resultatliste og analyse av svakheter per tastetrykk.

## Funksjoner

- **Tre testmoduser** — Tid (15s/30s/60s/120s), Ord og Sitat
- **Tre vanskelighetsgrader** — Lett, Middels, Vanskelig ordbank
- **Statistikk i sanntid mens du skriver** — ord i minuttet (WPM), nøyaktighet, gjenstående tid, antall tegn skrevet og antall rettelser
- **Feilsporing** — tegn du skriver feil og senere retter markeres tydelig annerledes enn tegn du fikk riktig med én gang
- **Svakhetsanalyse** — etter hver test får du en oversikt over hvilke taster du sliter mest med og hvilke bokstavkombinasjoner som går tregest, med et konkret tips til hva du bør øve på
- **Resultatliste** — beste resultater med pallvisning, filtrerbar per modus
- **Statistikk og historikk** — antall tester totalt, gjennomsnittlig/beste WPM, gjennomsnittlig nøyaktighet og en graf over WPM-historikk
- **Lyst/mørkt tema**, tastelyder og hurtigtaster (Tab for å starte på nytt, Esc for å nullstille)

## Teknologi

- **Backend:** Node.js, Express, better-sqlite3
- **Frontend:** ren HTML/CSS/JS (ingen byggeprosess, ingen rammeverk)

## Kom i gang

```bash
npm install
npm run dev
```

Appen kjører på [http://localhost:3000](http://localhost:3000) som standard (overstyr med miljøvariabelen `PORT`).

## API

| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| GET | `/api/scores` | Hent resultatliste (valgfritt `?mode=`-filter) |
| POST | `/api/scores` | Lagre et nytt resultat på resultatlisten |
| DELETE | `/api/scores/:id` | Fjern et resultat fra resultatlisten |
| POST | `/api/history` | Registrer en gjennomført test for statistikk/historikk |
| GET | `/api/stats` | Samlet statistikk + WPM-historikk (valgfritt `?limit=`) |
| DELETE | `/api/history` | Tøm testhistorikken |
| GET | `/api/health` | Statussjekk |
