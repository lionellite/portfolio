# Guide de publication

## Préparation

Avant de publier, vérifiez que le profil, les projets et les articles visibles sont à jour, que l’adresse e-mail du profil est correcte et que les notifications de contact disposent d’une clé e-mail valide. Passez les contrôles techniques :

```bash
pnpm check && pnpm test && pnpm build
```

La publication doit partir d’un point de restauration qui contient le code, le schéma et la documentation attendus. Ne publiez pas un état qui contient des erreurs de compilation, des migrations non appliquées ou des secrets ajoutés dans les fichiers source.

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
