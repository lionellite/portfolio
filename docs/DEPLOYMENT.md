# Guide de publication

## Préparation

Avant de publier, vérifiez que le profil, les projets et les articles visibles sont à jour, que l’adresse e-mail du profil est correcte et que les notifications de contact disposent d’une clé e-mail valide. Passez les contrôles techniques :

```bash
pnpm check && pnpm test && pnpm build
```

La publication doit partir d’un point de restauration qui contient le code, le schéma et la documentation attendus. Ne publiez pas un état qui contient des erreurs de compilation, des migrations non appliquées ou des secrets ajoutés dans les fichiers source.

## Déploiement Vercel

Le dépôt contient désormais `vercel.json` et `api/index.ts`. Le premier configure le build Vite et le fallback SPA ; le second expose Express en fonction serverless pour tRPC, OAuth et le proxy de stockage.

Dans Vercel, importez le dépôt GitHub, conservez **Install Command** sur `pnpm install --frozen-lockfile`, **Build Command** sur `pnpm build` et **Output Directory** sur `dist/public`. Ajoutez les variables `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `RESEND_API_KEY` et les variables de stockage de l’environnement WebDev.

Après le premier déploiement, ajoutez l’URL Vercel comme redirect URI OAuth dans la configuration Manus : `https://votre-domaine.vercel.app/api/oauth/callback`. Vérifiez ensuite `/api/health`, l’accueil, le formulaire de contact et la connexion `/admin`.

## Publication et domaine

Créez d’abord un checkpoint, puis utilisez l’action **Publier** depuis l’interface de gestion du projet. Le domaine temporaire peut être personnalisé depuis les paramètres ; un domaine personnalisé peut ensuite être relié depuis la même zone de gestion.

| Étape | Vérification |
| --- | --- |
| Contenu | Les projets et articles qui doivent être publics ont le statut publié. |
| Contact | Le formulaire affiche sa confirmation et l’e-mail du profil est correct. |
| OAuth | L’administration protège bien la route `/admin`. |
| Mobile | Le menu, les cartes et le formulaire restent utilisables à 390 px de large. |
| Domaine | Les enregistrements DNS requis sont validés avant communication du lien final. |

## Après publication

Effectuez un test de navigation sur le domaine publié : accueil, liste de projets, fiche projet, blog, article, contact et connexion administrateur. Envoyez un message de contact de test, puis confirmez sa présence dans l’administration et la réception de la notification.
