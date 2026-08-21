# Exploitation et maintenance

## Contrôles avant livraison

Avant une livraison ou une publication, exécutez les contrôles ci-dessous depuis la racine du dépôt.

```bash
pnpm check
pnpm test
pnpm build
```

| Contrôle | Objectif |
| --- | --- |
| Typage | Détecter les incompatibilités TypeScript et les erreurs de contrat. |
| Tests | Vérifier les protections d’accès, validations, mutations de contenu, stockage et e-mail. |
| Build | Valider la production du bundle front-end et serveur. |
| Vérification visuelle | Contrôler l’accueil, les listes, les détails, le contact et l’administration sur desktop et mobile. |

## Maintenance des dépendances

Mettez à jour les dépendances de manière mesurée. Après une mise à niveau, contrôlez le fichier de verrouillage, relancez l’installation puis les scripts de vérification. Les évolutions de dépendances susceptibles de changer les APIs de React, Vite, tRPC, Drizzle ou Tailwind doivent être effectuées dans une branche ou un checkpoint distinct.

## Migrations de données

Les changements de tables suivent ce processus : modifier `drizzle/schema.ts`, générer la migration, lire le SQL produit, appliquer la migration, puis vérifier l’application. Évitez les suppressions ou renommages directs sans stratégie de conservation des données.

```bash
pnpm drizzle-kit generate
# Relire le SQL généré puis l’appliquer avec l’outil de base de données du projet.
```

## Secrets et délivrabilité e-mail

La variable `RESEND_API_KEY` est requise pour la notification e-mail des messages de contact. Pour une mise en production fiable, configurez un domaine expéditeur validé dans le fournisseur d’e-mail et mettez à jour l’adresse d’expédition côté serveur si nécessaire. N’utilisez jamais un secret dans le code front-end.

## Sauvegarde et restauration

Créez un point de restauration après un lot cohérent de changements validés. Conservez également une exportation périodique de la base de données et une copie des images source utilisées par le portfolio. Les fichiers placés dans le stockage objet doivent être considérés comme la source de vérité pour les médias publiés.
