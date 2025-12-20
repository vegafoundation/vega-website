# VEGA OS

Meta-operating system scaffold for Vega modules, dashboards, APIs, and telemetry.

## Structure
- `frontend/`: React + Vite + Tailwind dashboard showcasing Vega modules and controls.
- `backend/`: Express service exposing health checks, admin config, telemetry intake, and engine stubs.
- `mobile/`: Placeholders for SwiftUI and Jetpack Compose clients.
- `api_connectors/`, `infinity_loop/`, `soundscapes/`, `whitepaper_portal/`, `admin/`: module stubs ready for expansion.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   npm --workspace frontend install
   npm --workspace backend install
   ```
2. Create `backend/.env` based on `.env.example` and add API keys.
3. Run services:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## Testing
- Backend uses Node test runner placeholder via `npm --workspace backend test`.
