# Brief backend simple

Salut,

je veux juste te dire quoi ajouter/modifier cote backend pour que le mobile fonctionne bien. Pas besoin de regarder mon code, je te mets les besoins par ecran.

## Ce qui est prioritaire

1. Auth avec numero de tel + mot de passe
2. Register driver complet avec les 4 steps
3. Un reset mot de passe si possible
4. Les donnees pour afficher dashboard, missions, wallet et profil

## 1) Auth

### A faire

- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- si possible POST /auth/forgot-password
- si possible POST /auth/reset-password

### Login attendu

L'app veut pouvoir se connecter avec:

```json
{
  "identifier": "telephone_ou_email",
  "password": "mot_de_passe"
}
```

Regle simple:
- si `identifier` ressemble a un email, on login par email
- sinon, on login par numero de telephone

Tu peux garder aussi l'ancien format `email + password` pour ne pas casser la transition.

### Reset mot de passe si tu le fais

Proposition simple:

- POST /auth/forgot-password
```json
{ "identifier": "telephone_ou_email" }
```

- POST /auth/reset-password
```json
{ "token": "string", "newPassword": "string" }
```

## 2) Register driver: ce qu'il faut corriger

Le register driver est decoupe en 4 steps. Il faut prendre tout ce que le mobile demande, et laisser en option ce qui ne doit pas empecher l'inscription.

### Step 1 - Identite

Champs a prendre:

| Champ | Type DB conseille | Choix possibles | Exemple | Obligatoire |
|---|---|---|---|---|
| firstName | String | non | Jean | oui |
| lastName | String | non | Dupont | oui |
| email | String | non | jean@mail.com | oui |
| phone | String | non | +33612345678 | oui |
| password | String | non | Password123! | oui |
| birthDate | DateTime | non | 1998-05-12 | oui |
| gender | enum Gender | MALE, FEMALE, UNDEFINED | MALE | oui |

### Step 2 - Adresse / transport

| Champ | Type DB conseille | Choix possibles | Exemple | Obligatoire |
|---|---|---|---|---|
| address | String | non | 22 boulevard Clemenceau, Grenoble | oui |
| city | String | non | Grenoble | oui |
| zipCode | String | non | 38000 | non, auto-rempli |
| street | String | non | boulevard Clemenceau | non, auto-rempli |
| deliveryCity | String | non | Grenoble | oui |
| deliveryRadius | Int | non | 15 | oui |
| transportType | enum TransportType | velo, moto, voiture, utilitaire | moto | oui |
| equipments | String[] ou Json | isotherme, chariot, casque, gants | ["isotherme", "casque"] | oui |

### Step 3 - Documents

| Champ | Type DB conseille | Choix possibles | Exemple | Obligatoire |
|---|---|---|---|---|
| cniFile | String | non | https://.../cni.jpg | oui ou a rendre optionnel selon ton flux |
| justificatifFile | String | non | https://.../justif.jpg | oui ou a rendre optionnel selon ton flux |
| permisFile | String | non | https://.../permis.jpg | non si velo, sinon conseille |
| carteGriseFile | String | non | https://.../cartegrise.jpg | non si velo, sinon conseille |

Important:
- si le transportType est velo, permisFile et carteGriseFile peuvent etre facultatifs
- si le transportType est moto/voiture/utilitaire, tu peux les rendre obligatoires si tu veux
- le mobile envoie des fichiers locaux, donc il faut soit un endpoint upload, soit un stockage avec URL finale

### Step 4 - Infos pro

| Champ | Type DB conseille | Choix possibles | Exemple | Obligatoire |
|---|---|---|---|---|
| siret | String | non | 12345678900012 | non, si tu veux laisser l'inscription passer |
| kbisFile | String | non | https://.../kbis.pdf | non |
| ribFile | String | non | https://.../rib.pdf | non |

### Ce que le backend doit accepter au register driver

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "birthDate": "YYYY-MM-DD",
  "gender": "MALE|FEMALE|UNDEFINED",
  "address": "string",
  "city": "string",
  "zipCode": "string?",
  "street": "string?",
  "deliveryCity": "string",
  "deliveryRadius": 15,
  "transportType": "velo|moto|voiture|utilitaire",
  "equipments": ["isotherme", "chariot", "casque", "gants"],
  "cniFile": "string?",
  "justificatifFile": "string?",
  "permisFile": "string?",
  "carteGriseFile": "string?",
  "siret": "string?",
  "kbisFile": "string?",
  "ribFile": "string?",
  "avatarUrl": "string?"
}
```

### Reponse attendue apres register/login/refresh

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "uuid",
    "email": "string",
    "role": "DRIVER"
  }
}
```

## 3) Ce qu'il faut envoyer par page pour afficher l'UI

## Login

Champs UI:

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| identifier | String | email ou telephone | +33612345678 |
| password | String | non | Password123! |

## Dashboard / Tableau de bord

### A faire

- GET /driver/me/dashboard
- PATCH /driver/me/availability
- PATCH /driver/me/location

### Variables attendues

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| isOnline | Boolean | true, false | true |
| todayEarnings | Float | non | 24.5 |
| todayTrips | Int | non | 5 |
| currentLocation.lat | Float | non | 48.8566 |
| currentLocation.lng | Float | non | 2.3522 |
| coverageRadiusMeters | Int | non | 1000 |

## Missions

### A faire

- GET /driver/me/missions/available
- POST /driver/me/missions/{missionId}/accept
- GET /driver/me/missions/active
- GET /driver/me/missions/history

### Variables de mission

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| id | UUID/String | non | uuid |
| type | String | Alimentaire, Colis, Autre | Alimentaire |
| store | String | non | Monoprix Paris 11 |
| reward | Float | non | 7.5 |
| distanceKm | Float | non | 1.2 |
| pickupAddress | String | non | 10 rue de la Paix |
| dropOffAddress | String | non | 22 boulevard Clemenceau |
| status | enum OrderStatus | SEARCHING_DRIVER, DRIVER_ASSIGNED, DRIVER_ACCEPTED, PICKED_UP, DELIVERED, CANCELLED | SEARCHING_DRIVER |

## Wallet

### A faire

- GET /driver/me/wallet
- GET /driver/me/wallet/entries
- POST /driver/me/wallet/withdrawals

### Variables wallet

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| balance | Int ou Float | non | 245.5 |
| currency | String | EUR | EUR |
| pendingAmount | Float | non | 20 |

### Variables wallet entry

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| id | UUID/String | non | uuid |
| type | enum WalletEntryType | CREDIT, DEBIT | CREDIT |
| amount | Int ou Float | non | 8.5 |
| status | enum simple | PENDING, COMPLETED, CANCELLED | PENDING |
| createdAt | DateTime | non | 2026-04-04T14:20:00.000Z |

## Profil

### A faire

- GET /driver/me/profile
- PATCH /driver/me/profile
- PATCH /driver/me/session-vehicle
- GET /driver/me/referral
- GET /driver/me/documents

### Variables profil

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| id | UUID/String | non | uuid |
| firstName | String | non | Jean |
| lastName | String | non | Paul |
| avatarUrl | String | non | https://.../avatar.jpg |
| phone | String | non | +33612345678 |
| email | String | non | jean@mail.com |
| rating | Float | non | 4.9 |
| totalTrips | Int | non | 128 |
| activeVehicle | enum VehicleType | velo, moto, voiture, utilitaire | velo |
| gomileCode | String | non | GM-8829-2026 |
| status | enum DriverStatus simple | AVAILABLE, BUSY, OFFLINE | AVAILABLE |

### Variables session vehicle

| Variable | Type DB conseille | Choix possibles | Exemple |
|---|---|---|---|
| vehicle | enum VehicleType | velo, moto, voiture, utilitaire | moto |

## Docs / fichiers

Le mobile peut envoyer des fichiers locaux, donc il faut une vraie strategie upload.

Je te conseille:

1. POST /uploads en multipart
2. ou POST /uploads/presign si tu veux stocker ailleurs

Ensuite tu gardes juste l'URL finale en base.

## Si tu veux aller vite

Fais d'abord:

1. login avec numero + mdp
2. register driver complet avec champs optionnels
3. reset password
4. dashboard + missions
5. wallet + profil


