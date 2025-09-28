# Repository Guidelines

## Project Structure & Modules
- `apps/`: Applications
  - `apps/web/` (Vite + React) — UI
  - `apps/mobile/` (Expo + React Native) — app
- `services/api/` (FastAPI) — backend API
- `packages/`: Shared libraries (e.g., `ui/`, `stroke-capture/`, `figma-sync/`)
- `docs/`, `specs/`, `figma-*`, `archive/` — documentation, specs, assets

## Build, Test, Run
- Root (Turbo across workspaces):
  - `npm run dev` — run all `dev` tasks
  - `npm run build` — build all packages/apps
  - `npm test` — run all tests
  - `npm run lint` — ESLint + Prettier checks
- Web:
  - `cd apps/web && npm run dev` (Vite)
  - `npm run test` (Vitest), `npm run build`
- Mobile:
  - `cd apps/mobile && npm start` (Expo) or `npm run ios|android|web`
- API:
  - `cd services/api && uvicorn main:app --reload`
  - Python deps: `pip install -r requirements.txt`
  - Note: `docker-compose.yml` may reference `services/backend`; update to `services/api` if using Docker.

## Coding Style & Naming
- Prettier: single quotes, semicolons, trailing commas, width 100.
- ESLint: `@typescript-eslint` + `eslint:recommended`; RN overrides for `apps/mobile`.
- Indentation: 2 spaces (Prettier default).
- Naming: kebab-case for files (`stroke-capture`), PascalCase for React components, camelCase for vars.

## Testing Guidelines
- Web/Packages: Vitest + Testing Library.
- Mobile: Jest (jest-expo) + Testing Library.
- Locations: `__tests__/` or `*.test.ts(x)`; co-locate near code when practical.
- Run: `npm test` at repo root, or per workspace.

## Collaboration & Handoff (Team B process)
- Plan → Confirm → Implement → Report → Record
  - Before changes: share a brief plan and get approval.
  - After changes: report what changed and any impacts.
  - Record agreements and process notes in agent files (e.g., this file, team-specific docs).

## Commit & PR Guidelines
- Conventional Commits enforced by commitlint (e.g., `feat(web): add practice canvas`).
- Husky hooks: pre-commit (lint-staged), commit-msg (commitlint), pre-push (`npm test`).
- PRs: clear description, link Issues, include screenshots for UI, steps to test, and check CI green.

## Security & Config
- Never commit secrets. Use env files (e.g., `services/api/.env`, `packages/figma-sync/.env.example`).
- Node >= 18, npm >= 9; Python 3.11 recommended for API.
- For local AI tools (Ollama), ensure services are running before integration tests.
