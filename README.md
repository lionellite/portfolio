# Portfolio de Lionel Adoukonou

Ce dépôt contient le portfolio personnel de **Lionel Adoukonou**. Il associe une vitrine publique consacrée au profil, aux projets, aux articles et au contact, avec un espace d’administration privé réservé au propriétaire via OAuth.

Le projet privilégie une présentation éditoriale et technique : une navigation publique responsive, des contenus gérés en base de données, des images stockées de manière sécurisée, un blog avec texte riche assaini et des notifications e-mail pour les demandes de contact.

## Sommaire

| Document | Objet |
| --- | --- |
| [Guide d’administration](ADMIN_GUIDE.md) | Gérer le profil, les projets, les articles et les messages. |
| [Architecture](docs/ARCHITECTURE.md) | Comprendre les couches applicatives, les données et les routes. |
| [Gestion de contenu](docs/CONTENT_MANAGEMENT.md) | Publier des projets, articles, visuels et parcours. |
| [Exploitation et maintenance](docs/OPERATIONS.md) | Contrôler la qualité, les tests, la sécurité et les sauvegardes. |
| [Publication](docs/DEPLOYMENT.md) | Préparer une version publiable et configurer le domaine. |
| [Dépannage](docs/TROUBLESHOOTING.md) | Diagnostiquer les erreurs courantes. |

## Fonctionnalités

| Domaine | Fonctionnalités livrées |
| --- | --- |
| **Site public** | Accueil, parcours, compétences, projets, blog, pages de détail et formulaire de contact. |
| **Administration** | Gestion du profil, des compétences, expériences, formations, projets, images, articles et messages. |
| **Sécurité** | Authentification OAuth, contrôle du rôle administrateur côté serveur et nettoyage du HTML riche. |
| **Communication** | Enregistrement des messages, notification propriétaire et notification e-mail transactionnelle. |
| **Qualité d’interface** | Responsive design, états vides et d’erreur, squelettes de chargement, indicateurs de traitement et préférence de mouvement réduit. |

## Stack technique

L’application repose sur **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, **Express**, **tRPC 11**, **Drizzle ORM** et une base MySQL/TiDB. L’authentification OAuth, le stockage d’images compatible S3 et les notifications sont intégrés à l’environnement de projet.

| Couche | Technologies et responsabilité |
| --- | --- |
| Interface | React, Wouter, TanStack Query, Tailwind CSS, Lucide. |
| Serveur | Express et tRPC pour les contrats d’API typés. |
| Données | Drizzle ORM et MySQL/TiDB pour les contenus et métadonnées. |
| Fichiers | Stockage objet pour les portraits et couvertures de projets. |
| E-mail | Resend pour les alertes de formulaire de contact. |

## Démarrage local

### Prérequis

Utilisez **Node.js 22** et **pnpm**. L’environnement doit fournir une base de données accessible et les variables d’authentification prévues par le projet. Ne créez jamais de fichier `.env` contenant des secrets destinés à être commis.

```bash
pnpm install
pnpm dev
```

Le serveur de développement démarre avec l’interface et le serveur applicatif. Pour une vérification de qualité avant toute livraison, exécutez :

```bash
pnpm check
pnpm test
pnpm build
```

## Scripts disponibles

| Commande | Usage |
| --- | --- |
| `pnpm dev` | Lance le serveur de développement avec surveillance des fichiers. |
| `pnpm check` | Vérifie le typage TypeScript sans produire de build. |
| `pnpm test` | Exécute la suite Vitest. |
| `pnpm build` | Produit le build front-end et le bundle serveur. |
| `pnpm start` | Lance le build de production. |
| `pnpm format` | Formate les fichiers avec Prettier. |
| `pnpm db:push` | Génère et applique les migrations Drizzle. À réserver aux changements de schéma validés. |

## Configuration et secrets

Les valeurs de configuration sont injectées dans l’environnement. Les principales variables attendues sont `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `RESEND_API_KEY` et les clés de stockage fournies par l’environnement.

> **Sécurité.** N’exposez jamais une clé Resend, une chaîne de connexion, un secret JWT ou un jeton OAuth dans le code client, les captures d’écran, les tickets ou l’archive publique du projet.

## Structure de dépôt

```text
client/             Interface React et styles
server/             Routeurs tRPC, accès aux données et services serveur
drizzle/            Schéma et migrations de base de données
shared/             Types et constantes partagées
docs/               Documentation technique et guides d’exploitation
ADMIN_GUIDE.md      Guide d’administration fonctionnelle
todo.md              Historique de réalisation et suivi du projet
```

## Règles de contribution

Toute évolution fonctionnelle doit être ajoutée à `todo.md` avant implémentation, couverte par des tests pertinents, vérifiée en TypeScript et contrôlée visuellement sur desktop et mobile. Les changements de schéma doivent respecter l’ordre : schéma Drizzle, migration générée, revue SQL, application et test.

## Licence

Le code est distribué sous licence **MIT**, conformément au fichier de configuration du projet. Les contenus personnels, textes, images et éléments de marque du portfolio restent sous le contrôle de Lionel Adoukonou.
