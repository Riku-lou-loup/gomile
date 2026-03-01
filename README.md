# GoMile Monorepo

GoMile est un dépôt multi-applications qui contient :
- `apps/api` : backend NestJS
- `apps/web` : application web Next.js
- `apps/mobile` : application mobile Expo React Native
- `packages/*` : packages partagés du workspace (actuellement initialisés)

## Structure du dépôt

```text
.
├── apps/
│   ├── api/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── config/
│   ├── eslint-config/
│   └── types/
├── infra/
│   └── docker-compose.yml
└── docs/
    └── Cahier des charges.pdf
```

## Prérequis

- Node.js 22 LTS (recommandé)
- Docker + Docker Compose (pour Postgres/Redis en local)

## Gestionnaire de paquets (Corepack + pnpm)

Le dépôt fixe la version de pnpm dans `package.json` (`packageManager`).
Utilisez Corepack pour que toute l'équipe et la CI utilisent la même version.

```bash
# Active Corepack (à faire une seule fois sur la machine)
corepack enable

# Active explicitement la version pnpm du projet
corepack prepare pnpm@10.30.3 --activate
```

## Installer les dépendances

```bash
# Installe toutes les dépendances du monorepo (apps + packages)
# avec la version pnpm définie dans packageManager
pnpm install
```

## Démarrer l'infrastructure locale

```bash
# Démarre Postgres/PostGIS et Redis en arrière-plan depuis le fichier infra
docker compose -f infra/docker-compose.yml up -d
```

Cela démarre :
- PostgreSQL + PostGIS sur `localhost:5432`
- Redis sur `localhost:6379`

## Configuration d'environnement

Créer `apps/api/.env` avec :

```env
DATABASE_URL="postgresql://gomile:gomile@localhost:5432/gomile?schema=public"
PORT=3000
```

## Lancer les applications

Depuis la racine du dépôt :

```bash
# Lance l'API NestJS en mode développement (watch)
pnpm --filter api start:dev

# Lance l'application web Next.js en mode développement
pnpm --filter web dev

# Lance l'application mobile Expo (QR code/émulateur)
pnpm --filter mobile start
```

Remarques :
- L'API utilise le port `3000` par défaut.
- Le Web utilise aussi le port `3000` par défaut ; lancez-le sur un autre port si l'API tourne déjà :

```bash
# Lance le serveur web sur le port 3001 (utile si l'API occupe déjà 3000)
pnpm --filter web dev -- --port 3001
```

## Scripts du workspace racine

```bash
# Construit tous les workspaces qui exposent un script build
pnpm build

# Exécute le lint sur tous les workspaces qui exposent un script lint
pnpm lint

# Lance la vérification TypeScript sur tous les workspaces qui exposent typecheck
pnpm typecheck
```

Le `pnpm dev` à la racine suppose que chaque workspace expose un script `dev`. Ce n'est pas encore le cas pour toutes les apps, donc privilégiez les commandes par application ci-dessus.

## Tests

```bash
# Lance les tests API en local
pnpm --filter api test

# Lance les tests API en mode CI (compatible même s'il n'y a pas de tests)
pnpm --filter api test:ci
```

## Base de données API (Prisma)

La configuration Prisma actuelle se trouve dans :
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma.config.ts`

Commandes utiles (avec explications) :

```bash
# Applique les changements de schema a la base locale:
# - cree une migration SQL si necessaire
# - execute la migration sur la base definie par DATABASE_URL
# - met a jour les fichiers de migration dans apps/api/prisma/migrations
pnpm --filter api exec prisma migrate dev

# Regenere uniquement le client Prisma a partir du schema:
# - ne modifie pas la base de donnees
# - met a jour le client genere dans apps/api/generated/prisma
pnpm --filter api exec prisma generate
```
