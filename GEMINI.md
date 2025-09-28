# Gemini Code Assistant Context

## Project Overview

This is a monorepo for an AI-powered calligraphy learning platform. The project consists of a React Native mobile app, a React web app for administration, and a Python backend. The monorepo is managed using Turbo.

### Key Technologies:

*   **Mobile App:** React Native, Expo
*   **Web App:** React, Vite
*   **Backend:** Python, FastAPI
*   **Monorepo:** Turbo

## Team & Roles

*   **Team A (Claude Code):** Backend & Evaluation Engine
*   **Team B (Cursor Codex):** React App Implementation & UI
*   **Team C (Gemini):** My Role - Design, UX, and UI Verification.

## My Current Tasks

Based on the latest `specs/tasks.md`, my assigned tasks are:

1.  **Task 3.5: Service Flow Copy Alignment** *(new)*
    *   **My Responsibility:** Review Team B's Home → Camera/Canvas → Evaluation copy updates against `specs/spec.md`, `specs/plan.md`, and `docs/design/user-journey.md`; share any UI tone/wording adjustments needed.
2.  **Task 5: CameraScreen Canvas Integration**
    *   **My Responsibility:** Provide a design guide for Canvas placement.
3.  **Task 12: EvaluationScreen Integration**
    *   **My Responsibility:** Add animations for the score display.
4.  **Task 19: E2E Testing**
    *   **My Responsibility:** Add UI/UX flow verification to the Playwright tests.

I will work on these specific tasks in collaboration with the other teams.

## Building and Running

### Prerequisites:

*   Node.js >= 18
*   npm >= 9
*   Python 3.11

### Installation:

```bash
npm ci
```

### Running the applications:

*   **Mobile App (Expo):**
    ```bash
    cd apps/mobile && npm start
    ```
*   **Web App (Vite):**
    ```bash
    cd apps/web && npm run dev
    ```
*   **Backend (FastAPI):**
    ```bash
    cd services/api && uvicorn main:app --reload
    ```
    or with Docker:
    ```bash
    docker compose up --build
    ```

### Testing:

```bash
turbo run test
```

## Development Conventions

*   **Commit Messages:** Conventional Commits (enforced by `commitlint`).
*   **Linting:** ESLint and Prettier (enforced by a `pre-commit` hook with `lint-staged`).
*   **Testing:** Jest for the mobile app and Vitest for the web app.
*   **CI/CD:** GitHub Actions are used for continuous integration.
