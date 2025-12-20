# Vega Foundation prototype

Modular, API-ready Vega Foundation experience with admin controls, immersive visuals, and placeholder whitepaper/soundscape data.

## Getting started
1. Install dependencies: `npm install`
2. Run locally: `npm run dev`
3. Set `ADMIN_PASSWORD` and API keys in a `.env` file to protect the admin console.
4. Hit `/api/manifest` for the deploy-ready manifest, `/api/infinity` for loop telemetry, and `/whitepaper.html` for the static paper mirror. If the API endpoints are unavailable, the UI and whitepaper page will automatically fall back to `/public/data/*.json`.

## Features
- Express server with token-based admin login
- Editable config persisted to `public/data/config.json`
- Whitepaper endpoint at `/api/whitepaper`
- Glassmorphic, responsive UI with animated grid canvas
- Live engine grid, heartbeat badge, changelog feed, source health matrix, and themed admin overrides
- Manifest endpoint `/api/manifest`, module registry `/api/modules`, soundscape playlists `/api/soundscapes`, and infinity loop telemetry at `/api/infinity`
- Static whitepaper mirror at `/whitepaper.html`, audio toggle wired to curated playlists, and sticky navigation links for every module section
