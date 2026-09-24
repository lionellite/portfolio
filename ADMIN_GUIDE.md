# Guide d’administration du portfolio

L’espace d’administration est disponible à l’adresse `/admin`. Il est protégé par l’authentification OAuth et par le rôle administrateur du propriétaire du projet. Après connexion, la navigation latérale donne accès à la vue d’ensemble, au profil, aux projets, aux articles et aux messages.

| Rubrique | Usage principal | Résultat public |
| --- | --- | --- |
| **Vue d’ensemble** | Consulter les volumes de contenu, les projets récents et les derniers messages. | Aucun affichage direct, cette page synthétise l’activité. |
| **Profil & parcours** | Modifier l’identité, les coordonnées, la biographie, les compétences, expériences et formations. | Met à jour l’accueil et les sections de parcours. |
| **Projets** | Ajouter, éditer, supprimer, publier, mettre en avant et illustrer les projets. | Alimente les listes et les pages détaillées de projets. |
| **Articles** | Créer des brouillons, les éditer avec l’éditeur riche, publier ou dépublier des articles. | Alimente la rubrique Notes et les pages d’article. |
| **Messages** | Consulter les formulaires de contact reçus. | Aucun affichage direct. |

## Gérer le profil et le parcours

La page **Profil & parcours** centralise les informations personnelles. La photo de profil peut être importée directement depuis cette page au format PNG, JPEG, WebP ou AVIF, dans une limite de 5 Mo. Après l’import, il faut utiliser le bouton d’enregistrement du profil afin de rendre la photo active sur le portfolio.

Les compétences, expériences et formations sont gérées séparément sous le formulaire principal. Chaque élément peut être ajouté, modifié grâce à l’icône de crayon ou supprimé grâce à l’icône de corbeille. Le champ **Ordre** permet de contrôler la position des éléments dans les sections publiques.

## Gérer les projets

Un projet exige un titre, un identifiant URL unique composé de minuscules, chiffres et tirets, un résumé, une description détaillée et au moins une technologie. Les technologies sont séparées par des virgules. La case **Publié** contrôle sa visibilité sur le site public ; la case **Mettre en avant** sélectionne le projet pour la page d’accueil.

La couverture est importée depuis l’appareil et stockée de manière sécurisée. Les projets sans image conservent une couverture graphique abstraite sur le site public, ce qui permet de les publier sans attendre un visuel définitif.

## Gérer les articles

L’éditeur de contenu permet le gras, l’italique, le soulignement, les listes, les citations, les blocs de code et les liens. Le contenu est nettoyé côté serveur avant sa publication. Un article créé sans cocher **Publier cet article** reste en brouillon et n’est visible que dans l’administration. Lorsqu’il est publié, sa date de publication est automatiquement enregistrée.

## Recevoir les demandes de contact

Chaque soumission du formulaire public est enregistrée dans **Messages**. Une notification propriétaire est déclenchée et un e-mail transactionnel est envoyé à l’adresse définie dans le profil. Le canal e-mail utilise la clé Resend configurée pour le projet. Pour une délivrabilité complète en production, utilisez un domaine d’expédition vérifié dans votre compte Resend.

> Les suppressions de projets, d’articles et des éléments de parcours sont définitives côté interface. Vérifiez l’élément sélectionné avant de confirmer la suppression.
