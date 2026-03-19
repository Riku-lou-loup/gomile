# GoMile Web (`apps/web`)

Application web Next.js (App Router) avec une couche BFF via `route.ts`.

## Périmètre

- Interface frontend web
- Endpoints Next côté web (`src/app/api/**/route.ts`)
- Proxy des appels vers le backend Nest

## Structure

```text
apps/web
├── src/app/                 # pages App Router + routes API
│   ├── api/                 # endpoints BFF
│   └── ...
├── src/lib/backend-proxy.ts # utilitaire de proxy partagé
└── public/                  # assets statiques
```

## Environnement

Créer `apps/web/.env.local` :

```env
API_BASE_URL=http://localhost:3000
```

`API_BASE_URL` doit pointer vers l'API Nest.

## Lancer l'application

```bash
pnpm --filter web dev -- --port 3001
```

## Routes BFF disponibles

Implémentées dans `src/app/api/**/route.ts` :

- `GET /api/health`
- `POST /api/order`
- `POST /api/accept_order`
- `POST /api/handshake/a`
- `POST /api/handshake/b`
- `PUT /api/livreurs/:id/kyc-approve`

Ces routes relaient les requêtes vers Nest via `src/lib/backend-proxy.ts`.

## Vérifications

```bash
pnpm --filter web lint
pnpm --filter web typecheck
pnpm --filter web build
```
