# Gomile Shipment

## Presentation

`Gomile Shipment` est un plugin WooCommerce qui ajoute une methode de livraison dediee a Gomile.

Son objectif est double :

- afficher une option de livraison Gomile pendant le panier et le checkout ;
- communiquer avec une API de livraison pour estimer le prix, creer une mission, suivre son statut et recevoir des mises a jour.

Aujourd'hui, le plugin est deja structure pour fonctionner meme si l'API n'est pas encore developpee :

- il peut afficher un tarif fixe en secours ;
- il sait deja preparer les appels API ;
- il expose un webhook pour les futures remontees de statut.

## Objectif fonctionnel

Le flux vise est le suivant :

1. Le client choisit `Gomile Delivery` au checkout.
2. WooCommerce calcule un prix de livraison.
3. Le plugin peut demander un devis a l'API Gomile.
4. Quand la commande est creee, le plugin peut creer une livraison dans l'API.
5. L'API Gomile renvoie un identifiant de livraison et un statut.
6. Plus tard, l'API peut notifier WooCommerce via un webhook.

## Architecture du plugin

Le plugin est organise par responsabilite.

### 1. Point d'entree

Fichier : [gomile-shipment.php](./gomile-shipment.php)

Role :

- declare le plugin a WordPress ;
- charge les traductions ;
- initialise les reglages admin ;
- charge les modules WooCommerce si WooCommerce est actif ;
- affiche une alerte admin si WooCommerce manque.

### 2. Reglages du plugin

Fichier : [includes/class-admin-settings.php](./includes/class-admin-settings.php)

Role :

- cree la page de configuration du plugin ;
- enregistre les options WordPress ;
- centralise la lecture des reglages ;
- expose des methodes utilitaires comme :
  - `get_option()`
  - `is_auto_create_enabled()`
  - `is_live_rates_enabled()`
  - `get_webhook_url()`

Reglages principaux :

- `api_base_url`
- `api_key`
- `auth_header`
- `auth_scheme`
- `enable_live_rates`
- `quote_endpoint`
- `quote_method`
- `quote_cache_minutes`
- `create_endpoint`
- `status_endpoint`
- `cancel_endpoint`
- `webhook_secret`

### 3. Methode de livraison WooCommerce

Fichier : [includes/class-shipping-method.php](./includes/class-shipping-method.php)

Role :

- declare une methode WooCommerce nommee `gomile_shipment` ;
- affiche cette methode dans les zones de livraison ;
- permet de configurer son titre, son cout et sa taxation ;
- calcule le prix affiche au client.

Point cle :

- `calculate_shipping()` commence avec un tarif fixe ;
- si les devis API sont actifs, la methode essaie de recuperer un prix distant ;
- si l'API echoue ou n'est pas prete, le tarif fixe reste utilise.

### 4. Client API

Fichier : [includes/class-delivery-api.php](./includes/class-delivery-api.php)

Role :

- preparer les payloads ;
- executer les requetes HTTP avec `wp_remote_request()` ;
- gerer l'authentification ;
- parser les reponses JSON ;
- gerer les erreurs ;
- mettre en cache les devis de livraison.

Fonctions principales :

- `get_delivery_quote($package, $shipping_method = null)`
- `create_delivery($order)`
- `get_delivery_status($delivery_id)`
- `cancel_delivery($delivery_id)`

Methodes importantes :

- `build_quote_payload()`
- `build_delivery_payload()`
- `request()`
- `extract_quote_price()`

### 5. Traitement des commandes

Fichier : [includes/class-order-handler.php](./includes/class-order-handler.php)

Role :

- ecouter la creation ou l'evolution d'une commande WooCommerce ;
- verifier si la methode choisie est `gomile_shipment` ;
- initialiser les metadonnees de suivi ;
- creer la livraison automatiquement si l'option est active.

Metadonnees utilisees sur la commande :

- `_gomile_shipment_status`
- `_gomile_shipment_delivery_id`
- `_gomile_shipment_tracking_url`
- `_gomile_shipment_delivery_created`
- `_gomile_shipment_last_error`

### 6. Webhook de retour API

Fichier : [includes/class-rest-endpoints.php](./includes/class-rest-endpoints.php)

Role :

- expose une route REST WordPress ;
- verifie un secret de webhook ;
- retrouve la commande par `order_id` ou `delivery_id` ;
- met a jour le statut et les metadonnees de livraison.

Route actuelle :

- `POST /wp-json/gomile-shipment/v1/webhook`

## Cycle de vie du plugin

### Au chargement du plugin

1. WordPress charge `gomile-shipment.php`.
2. Les reglages admin sont initialises.
3. Si WooCommerce est actif, les modules metier sont charges.

### Au panier / checkout

1. WooCommerce appelle `calculate_shipping()`.
2. Le plugin lit le cout fixe configure.
3. Si `enable_live_rates = yes`, il tente un devis API.
4. Si un prix valide est retourne, il remplace le cout fixe.
5. Sinon, le plugin garde le fallback local.

### A la creation de commande

1. Le plugin ecoute les hooks de creation de commande.
2. Il verifie que la commande utilise `gomile_shipment`.
3. Il initialise les metadonnees Gomile.
4. Si `auto_create = yes`, il appelle `create_delivery()`.
5. Il enregistre ensuite le statut, l'identifiant de livraison et le tracking.

### Lors d'un webhook

1. L'API Gomile appelle la route REST du plugin.
2. Le secret est verifie.
3. Le plugin retrouve la commande.
4. Il met a jour le statut local.
5. Il ajoute une note a la commande.

## Comment le prix de livraison fonctionne

Le systeme de prix suit une logique de degradation propre :

### Cas 1 : l'API de devis n'est pas prete

Le plugin utilise simplement le cout configure dans la methode WooCommerce.

### Cas 2 : l'API de devis est active

Le plugin :

- construit un payload de devis a partir du panier ;
- envoie la requete a `quote_endpoint` ;
- cherche une valeur de prix dans la reponse (`price`, `amount`, `cost`, `shipping_cost`, etc.) ;
- stocke la reponse en cache pendant quelques minutes.

### Cas 3 : l'API repond mal

Le plugin ne bloque pas le checkout.
Il revient au tarif fixe.

## Payloads prepares par le plugin

### Payload de devis

Le plugin prepare notamment :

- la methode de livraison ;
- l'adresse de pickup ;
- l'adresse de destination ;
- les lignes panier ;
- le poids total ;
- le sous-total ;
- le nombre d'articles.

### Payload de creation de livraison

Le plugin prepare notamment :

- l'identifiant de commande ;
- le numero de commande ;
- la devise ;
- le total ;
- le mode de paiement ;
- la note client ;
- les informations de pickup ;
- les informations de dropoff ;
- les articles de la commande.

## Points d'extension

Le code a ete prepare pour rester souple.

Filtres disponibles :

- `gomile_shipment_shipping_rate`
- `gomile_shipment_quote_payload`
- `gomile_shipment_delivery_payload`
- `gomile_shipment_delivery_headers`
- `gomile_shipment_delivery_request_args`

Ces filtres permettent d'adapter le plugin sans reecrire toute la logique.

## Limites actuelles

- l'API Gomile n'est pas encore finalisee ;
- le format exact des endpoints reste a definir ;
- la structure reelle des reponses n'est pas encore contractuelle ;
- les traductions ne couvrent pas encore tous les textes recents ajoutes.

## Ce qu'il faudra faire quand l'API sera disponible

1. Definir les endpoints exacts.
2. Definir le schema du devis.
3. Definir le schema de creation de livraison.
4. Definir le schema des webhooks.
5. Adapter `build_quote_payload()` et `build_delivery_payload()`.
6. Ajuster le parsing des reponses dans `extract_quote_price()` et `create_delivery()`.

## Resume technique

Le plugin repose sur une separation simple :

- `gomile-shipment.php` : chargement et initialisation ;
- `class-admin-settings.php` : configuration ;
- `class-shipping-method.php` : integration WooCommerce ;
- `class-delivery-api.php` : communication avec l'API ;
- `class-order-handler.php` : logique de commande ;
- `class-rest-endpoints.php` : retours webhook.

Cette structure est saine pour faire evoluer le projet sans melanger interface admin, logique WooCommerce et logique API.
