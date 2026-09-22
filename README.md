# TypeRush ⌨️

An interactive typing speed test with live stats, a leaderboard, and per-keystroke weak-point analysis.

## Features

- **Three test modes** — Time (15s/30s/60s/120s), Words, and Quote
- **Three difficulty levels** — Easy, Medium, Hard word pools
- **Live stats while typing** — WPM, accuracy, time remaining, characters typed, and corrections made
- **Error tracking** — characters you mistype and later fix are flagged distinctly from ones you got right the first time
- **Weak-point analysis** — after each test, a breakdown of your problem keys and slowest letter combinations, with a plain-English tip on what to practice
- **Leaderboard** — top scores with a podium view, filterable by mode
- **Stats & history** — total tests, average/best WPM, average accuracy, and a WPM history chart
- **Light/dark theme**, keyboard sound effects, and keyboard-only shortcuts (Tab to restart, Esc to reset)

## Tech stack

- **Backend:** Node.js, Express, better-sqlite3
- **Frontend:** vanilla HTML/CSS/JS (no build step, no framework)

## Getting started

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default (override with the `PORT` environment variable).

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scores` | List leaderboard scores (optional `?mode=` filter) |
| POST | `/api/scores` | Save a new leaderboard score |
| DELETE | `/api/scores/:id` | Remove a leaderboard score |
| POST | `/api/history` | Record a completed test for stats/history |
| GET | `/api/stats` | Aggregate stats + WPM history (optional `?limit=`) |
| DELETE | `/api/history` | Clear test history |
| GET | `/api/health` | Health check |
