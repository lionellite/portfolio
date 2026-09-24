# Architecture applicative

## Vue d’ensemble

Le portfolio est une application web full-stack organisée autour de contrats tRPC. L’interface React ne communique pas avec des routes REST ad hoc : elle invoque des procédures typées définies côté serveur. Cette organisation maintient une cohérence stricte entre les entrées de formulaire, la validation, les données retournées et les autorisations.

```text
Navigateur React
      │
      ▼
Client tRPC + TanStack Query
      │
      ▼
Routeurs tRPC (validation Zod et autorisation)
      │
 ┌────┴───────────────┐
 ▼                    ▼
Drizzle ORM       Services externes
 ▼                    ├─ Stockage d’images
MySQL/TiDB           └─ E-mail transactionnel
```

## Répertoires principaux

| Répertoire | Responsabilité |
| --- | --- |
| `client/src/pages` | Pages publiques, détails de contenu et écrans d’administration. |
| `client/src/components` | Composants réutilisables, layouts public et administrateur, éditeur riche. |
| `client/src/index.css` | Jetons visuels, styles responsives, états de chargement et règles de mouvement réduit. |
| `server/routers.ts` | Procédures tRPC publiques, protégées et administrateur. |
| `server/db.ts` | Fonctions d’accès aux données, sans logique d’interface. |
| `server/email.ts` | Notification e-mail lors d’un message de contact. |
| `drizzle/schema.ts` | Définition source des tables et relations. |
| `server/*.test.ts` | Tests d’accès, validation, contenu, stockage et e-mail. |

## Modèle de données

| Entité | Usage |
| --- | --- |
| `users` | Compte OAuth et rôle applicatif (`user` ou `admin`). |
| `profile` | Identité, biographie, coordonnées, liens, photo et disponibilité. |
| `skills` | Compétences classées et ordonnées. |
| `experiences` | Expériences professionnelles et académiques. |
| `educations` | Formations et certifications. |
| `projects` | Projets, technologies, liens, visuels, publication et mise en avant. |
| `posts` | Articles de blog, tags, contenu riche, brouillons et date de publication. |
| `contactMessages` | Messages visiteurs et état de notification. |

## Contrôle d’accès

Les données de présentation sont lues par les procédures publiques. Les opérations de création, mise à jour, suppression et import sont réservées à la procédure administrateur. Cette vérification est exécutée côté serveur à partir du rôle du compte OAuth, ce qui empêche un utilisateur non administrateur d’appeler une mutation directement.

> L’interface masque les écrans de gestion aux comptes non autorisés ; la sécurité effective demeure toutefois la vérification effectuée côté serveur.

## Cycle d’un message de contact

1. La page publique valide le nom, l’e-mail et le message.
2. La procédure `contact.submit` valide de nouveau les données côté serveur.
3. Le message est enregistré en base de données.
4. Une alerte propriétaire et une notification e-mail Resend sont tentées.
5. Le statut de notification est mis à jour sans empêcher la confirmation envoyée au visiteur.

## Cycle d’import d’image

Les imports de portrait et de couverture passent par une procédure administrateur. Le fichier est converti en données navigateur, validé, envoyé au stockage objet, puis seule sa référence est conservée dans la base de données. Les octets de fichier ne doivent jamais être enregistrés dans une colonne SQL.
