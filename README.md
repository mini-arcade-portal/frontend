**English** | [Magyar](README.hu.md)

# Mini Arcade — Frontend

React + Vite + TypeScript frontend for the Mini Arcade microservice project.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** with custom design tokens
- **React Router** for routing
- **TanStack Query** for server state
- **Zustand** for auth state (localStorage persistence)
- **axios** HTTP client (auto JWT injection)
- **react-hook-form** + **zod** for form validation

## Getting started

```bash
npm install
npm run dev
```

The frontend is then available at `http://localhost:5173`.

`/api/*` calls go through the Vite dev server proxy to the gateway
(`http://localhost:8080`) — no need to deal with CORS in dev.

## Running the backend

The frontend needs the full microservice stack:

```bash
cd ../infra
docker compose up --build
```

This starts: postgres, auth-service (8081), score-service (8082), gateway
(8080).

## Project structure

```
src/
├── api/          # axios client + API calls (auth, scores)
├── components/   # reusable UI components
├── pages/        # per-route pages
├── store/        # Zustand stores (authStore)
├── styles/       # global CSS / Tailwind base
├── App.tsx       # Routes + Layout
└── main.tsx      # entry point
```

## Routing

| Route | Protected | Component |
|---|---|---|
| `/login` | ❌ | LoginPage |
| `/register` | ❌ | RegisterPage |
| `/` | ✅ | HomePage (game picker) |
| `/play/:slug` | ✅ | PlayPage (snake / tictactoe) |
| `/leaderboard` | ✅ | LeaderboardPage |
| `/me` | ✅ | MyScoresPage |

## Production build

```bash
npm run build
```

The static build is written to `dist/`. In production, the backend URL is
configured via the `VITE_API_URL` env variable.
