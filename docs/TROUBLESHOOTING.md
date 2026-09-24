# Dépannage

## Commandes de diagnostic initiales

Lancez d’abord les contrôles suivants. Ils permettent d’isoler une erreur de typage, de test ou de build avant toute modification intrusive.

```bash
pnpm check
pnpm test
pnpm build
```

| Symptôme | Cause probable | Action recommandée |
| --- | --- | --- |
| L’administration refuse l’accès | Le compte connecté ne porte pas le rôle `admin`. | Vérifiez la connexion OAuth puis le rôle associé au compte propriétaire. |
| Les projets ou articles ne s’affichent pas | Contenu non publié ou échec de requête. | Contrôlez le statut dans l’administration, puis les états d’erreur et les journaux serveur. |
| L’image n’apparaît pas | Import interrompu, type non pris en charge ou référence absente. | Réimportez une image PNG, JPEG, WebP ou AVIF inférieure à 5 Mo. |
| Le formulaire confirme mais aucun e-mail n’arrive | Clé Resend ou domaine expéditeur non valide. | Vérifiez la clé et la configuration du domaine dans le fournisseur e-mail. |
| Le contenu riche est modifié à l’enregistrement | Le nettoyage HTML retire les éléments non sûrs. | Utilisez uniquement les formats de texte, liens et blocs de contenu proposés par l’éditeur. |
| Le build échoue après une migration | Le schéma et la base ne sont plus alignés. | Relisez la migration générée, appliquez-la puis relancez les tests. |

## Journaux

Les journaux de développement sont disponibles dans `.manus-logs/`. Consultez notamment `devserver.log` pour le serveur, `browserConsole.log` pour les erreurs client et `networkRequests.log` pour les requêtes. Recherchez d’abord la dernière entrée en erreur, puis reliez-la au composant ou au routeur concerné.

## Restauration

Si une modification rend l’application instable et qu’une correction directe ne suffit pas, restaurez le dernier checkpoint connu comme valide depuis l’interface de gestion du projet. Évitez d’utiliser une réinitialisation Git destructive sur un environnement contenant des données de portfolio actives.
