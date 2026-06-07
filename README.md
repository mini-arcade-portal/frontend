# Mini Arcade — Frontend

React + Vite + TypeScript frontend a Mini Arcade microservice projekthez.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** custom design tokenekkel
- **React Router** routing
- **TanStack Query** server state
- **Zustand** auth state (localStorage persistence)
- **axios** HTTP kliens (auto JWT injection)
- **react-hook-form** + **zod** form validáció

## Indítás

```bash
npm install
npm run dev
```

A frontend a `http://localhost:5173` címen érhető el.

A `/api/*` hívások a Vite dev server proxyján keresztül a gateway-re
(`http://localhost:8080`) jutnak — így nem kell CORS-szal bajlódni dev-ben.

## Backend futtatása

A frontend a teljes microservice stack-et igényli:

```bash
cd ../infra
docker compose up --build
```

Ez elindítja: postgres, auth-service (8081), score-service (8082), gateway (8080).

## Mappa-struktúra

```
src/
├── api/          # axios kliens + API hívások (auth, scores)
├── components/   # újrahasznosítható UI komponensek
├── pages/        # route-onkénti oldalak
├── store/        # Zustand store-ok (authStore)
├── styles/       # global CSS / Tailwind base
├── App.tsx       # Routes + Layout
└── main.tsx      # entry point
```

## Routing

| Route | Védett | Komponens |
|---|---|---|
| `/login` | ❌ | LoginPage |
| `/register` | ❌ | RegisterPage |
| `/` | ✅ | HomePage (játékválasztó) |
| `/play/:slug` | ✅ | PlayPage (snake / tictactoe) |
| `/leaderboard` | ✅ | LeaderboardPage |
| `/me` | ✅ | MyScoresPage |

## Production build

```bash
npm run build
```

A `dist/` mappába kerül a statikus build. Production-ben a `VITE_API_URL`
env-változóval állítható be a backend URL-je.
