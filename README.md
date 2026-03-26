# GoMile Monorepo

GoMile est un dépôt multi-applications qui contient :
- `apps/api` : backend NestJS (API métier + accès Prisma)
- `apps/web` : application web Next.js (App Router + routes BFF)
- `apps/mobile` : application mobile Expo React Native
- `infra` : services locaux Docker (Postgres/PostGIS + Redis)
- `docs` : documents projet (`Cahier des charges.pdf`)

## Structure du dépôt

```text
.
├── apps/
│   ├── api/
│   │   ├── src/
│   │   ├── prisma/
│   │   └── generated/prisma/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       └── lib/
│   └── mobile/
├── infra/
│   └── docker-compose.yml
└── docs/
    └── Cahier des charges.pdf
```

## Prérequis

- Node.js 22 LTS (recommandé)
- Docker + Docker Compose

## Gestionnaire de paquets (Corepack + pnpm)

Le dépôt fixe la version de pnpm dans `package.json` (`packageManager`).

```bash
# Active Corepack (à faire une seule fois sur la machine)
corepack enable

# Active explicitement la version pnpm du projet
corepack prepare pnpm@10.30.3 --activate
```

## Installer les dépendances

```bash
pnpm install
```

## Démarrer l'infrastructure locale

```bash
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml ps
```

Services attendus :
- PostgreSQL/PostGIS sur `localhost:5432`
- Redis sur `localhost:6379`

## Configuration d'environnement

Il faut créer vos propre fichiers d'environnement `apps/api/.env` à partir de `apps/api/.env.example` avec au minimum :

Màj (backend) 25 Mars : Utilisation de l'API OpenRouteService pour calculer la distance entre deux destination. Vous devez créer un compte gratuit pour récupérer les clés API pour continuer. Vous aurez normalement 1000 api calls par jour (c'est pas illimité !)
```env
DATABASE_URL="postgresql://gomile:gomile@localhost:5432/gomile?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=3000
JWT_ACCESS_SECRET="change-me-access-secret"
JWT_REFRESH_SECRET="change-me-refresh-secret"
ORS_API_KEY="ici faut utiliser vos clés api de OpenRouteService"
ORS_BASE_URL="https://api.openrouteservice.org"

```

Pour le proxy BFF web, créer `apps/web/.env.local` :

```env
API_BASE_URL=http://localhost:3000
```

## Base de données API (Prisma)

```bash
# Génère le client Prisma
pnpm --filter api exec prisma generate

# Crée/applique une migration locale, à faire à chaque fois le schéma DB change
pnpm --filter api exec prisma migrate dev --name <nom_migration>

# Ou simplement
pnpm --filter api exec prisma migrate dev
```

Fichiers concernés :
- Schéma : `apps/api/prisma/schema.prisma`
- Migrations : `apps/api/prisma/migrations/*`
- Client généré : `apps/api/generated/prisma/*`

## Lancer les applications

Depuis la racine du dépôt :

```bash
# API NestJS (dev)
pnpm --filter api start:dev

# Web Next.js (dev) sur 3001 pour éviter le conflit avec l'API (mais à configurer dans env)
pnpm --filter web dev -- --port 3001

# Mobile Expo
pnpm --filter mobile start
```

## Scripts du workspace racine

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Routes BFF exposées côté web

Ces routes sont appelées par le frontend, puis proxifiées vers Nest :
- `GET /api/health`
- `POST /api/order`
- `POST /api/accept_order`
- `POST /api/handshake/a`
- `POST /api/handshake/b`
- `PUT /api/livreurs/:id/kyc-approve`

Implémentation du proxy :
- `apps/web/src/lib/backend-proxy.ts`
