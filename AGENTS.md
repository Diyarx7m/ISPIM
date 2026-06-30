# ISPIM — Indigenous & Stateless Peoples Interactive Map

AI Studio app: React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Leaflet + Three.js + Express.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start unified Express+Vite dev server on **port 3000** |
| `npm run build` | Vite build + esbuild server bundle → `dist/` |
| `npm run start` | Run production server from `dist/server.cjs` |
| `npm run lint` | `tsc --noEmit` only (no ESLint/Prettier) |
| `npm run clean` | Remove `dist/` |

One-liner: `npm install && npm run dev`

## Env

- `GEMINI_API_KEY` — required in `.env.local` (gitignored) for AI Envoy features
- `APP_URL` — self-referential URL for callbacks
- `DISABLE_HMR=true` — disables HMR + file watching (AI Studio sets this)
- AI Studio auto-injects secrets at runtime

## Architecture

- **Entire app** is `src/App.tsx` (~1262 lines) — no routing, no pages
- **Server**: `server.ts` — Express serves `/api/gemini/generate` + Vite middleware (dev) or static `dist/` (prod)
- **Data**: `src/data/indigenousData.ts` (~2400 lines) — 150+ groups as typed array
- **3D globe**: `src/components/ThreeGlobe.tsx` (Three.js). 2D map uses Leaflet with CartoDB Dark Matter tiles
- **AI model**: `gemini-3.5-flash` — server-side only, no client-side API keys

## Path alias

`@/*` maps to project root (configured in both `tsconfig.json` and `vite.config.ts`).

## No tests

No test framework or test files exist in this project.

## Build output

- Frontend: `dist/assets/` (vite build)
- Server: `dist/server.cjs` (esbuild)
- Produced by `npm run build`, served by `npm run start`

## Notable

- Tailwind v4 — uses `@import "tailwindcss"` in CSS, not `@tailwind` directives
- Glassmorphism CSS classes defined in `src/index.css`: `.glass-panel`, `.glass-panel-gold`, `.glass-input`, `.glow-btn`
- Mobile has bottom tab bar: Map / Inspector / Envoy — only one visible at a time
- 3D globe auto-rotates by default; click markers to focus
- No git hooks, no CI config found
