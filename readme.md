# GoMile — Architecture du projet (guide développeurs)

Ce document décrit l’architecture cible du projet **GoMile** pour faciliter les contributions, limiter le couplage entre modules.

## Vue d’ensemble

Le repository est organisé autour de trois zones applicatives principales :

- `src/backend/` : logique serveur, règles métier, exposition API.
- `src/web/` : application front web (UI + consommation API backend).
- `src/App/` : application livreur

Autour de ces applications :

- `packages/` : code partagé réutilisable (types, schémas, utilitaires, SDK interne).
- `lib/` : composants techniques transverses installées pour le développement.

- `test/` : tests unitaires, transverses et d’intégration.
- `docs/` : documentation produit et technique (dont cahier des charges, liens et services backend).
- `bin/` : exécutables locaux (scripts de build, déploiement, maintenance).

<!-- ## 2) Arborescence recommandée

```text
GoMile/
├── src/
│   ├── backend/
│   │   ├── domain/            # Entités métier, règles invariantes, value objects
│   │   ├── application/       # Cas d’usage, orchestration métier
│   │   ├── infrastructure/    # DB, cache, providers, implémentations techniques
│   │   └── interfaces/        # API REST/GraphQL, DTO, contrôleurs
│   ├── web/
│   │   ├── app/               # Pages/routes
│   │   ├── features/          # Modules fonctionnels (ride, auth, payment, etc.)
│   │   ├── shared/            # UI partagée, hooks, utilitaires front
│   │   └── infrastructure/    # Client HTTP, gestion session, config front
│   └── App/
│       ├── app/
│       ├── features/
│       ├── shared/
│       └── infrastructure/
├── packages/
│   ├── types/                 # Types communs backend/web/app
│   ├── validation/            # Schémas de validation (entrée/sortie API)
│   └── api-client/            # SDK interne pour consommer le backend
├── lib/
│   ├── logging/
│   ├── config/
│   └── errors/
├── test/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture/
│   └── Cahier des charges.pdf
└── bin/
``` -->

<!-- ## 3) Règles d’architecture (obligatoires)

### Backend

Règle de dépendance (de l’extérieur vers le cœur) :

`interfaces -> application -> domain <- infrastructure`

Contraintes :

- `domain` ne dépend d’aucune couche technique.
- `application` dépend de `domain` uniquement.
- `infrastructure` implémente les ports définis par `application/domain`.
- `interfaces` convertit HTTP/transport vers DTO/cas d’usage sans logique métier lourde.

### Front (web + App)

Organisation par **feature métier** :

- Chaque feature contient ses composants, hooks, services, tests.
- Les éléments réellement communs vont dans `shared`.
- Aucun accès direct aux détails d’infrastructure depuis les composants UI : passer par des services/adapters.

### Partage de code

- `packages/types` est la source de vérité des contrats partagés.
- Les validations d’entrée/sortie sont centralisées dans `packages/validation`.
- Les clients API réutilisables sont centralisés dans `packages/api-client`.

## 4) Conventions de développement

- **Une feature = un module** avec ses fichiers regroupés.
- **Pas de dépendance circulaire** entre modules.
- **Nommage explicite** : pas d’abréviations ambiguës.
- **Fonctions courtes** et orientées responsabilité unique.
- **Erreurs normalisées** : format commun dans `lib/errors`.
- **Configuration centralisée** : lecture via `lib/config` uniquement.

## 5) Stratégie de tests

- Tests unitaires proches du code (dans chaque module/feature).
- Tests d’intégration dans `test/integration` pour les flux backend + DB + adapters.
- Tests end-to-end dans `test/e2e` pour les parcours critiques utilisateurs.

Minimum attendu avant merge :

- Cas nominal couvert.
- Cas d’erreur principal couvert.
- Non-régression sur les parcours critiques.

## 6) Documentation technique

Ajouter/mettre à jour dans `docs/` :

- `docs/architecture/` : schémas, décisions d’architecture (ADR), conventions.
- Notes d’impact lors de changements structurants (dépendances, contrats API, schémas de données).

## 7) Workflow de contribution

1. Créer une branche de feature.
2. Implémenter dans le module cible sans casser les règles de dépendance.
3. Ajouter/adapter les tests.
4. Mettre à jour la documentation impactée.
5. Ouvrir une PR avec description claire (contexte, choix, risques, validations).

## 8) Check-list rapide avant PR

- L’architecture en couches/features est respectée.
- Aucun code dupliqué alors qu’un package partagé existe.
- Les erreurs et la configuration utilisent `lib/`.
- Les tests pertinents passent localement.
- La doc est alignée avec les changements.

---

Ce README sert de base d’alignement équipe. En cas d’évolution majeure, créer une ADR dans `docs/architecture/` et référencer la décision dans la PR. -->
