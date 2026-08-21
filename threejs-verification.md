# Vérification de l’intégration Three.js

La scène 3D est intégrée au module de topologie de l’accueil. Elle représente un cœur de système maillé, des nœuds connectés, des flux et un nuage de particules. Les interactions pointeur restent localisées au module afin de ne pas perturber la navigation ou les contenus.

| Contexte | Comportement validé |
| --- | --- |
| Desktop | Le module Three.js s’affiche dans le cadre de topologie, avec orbite lente et réponse légère au pointeur. |
| Mobile et mouvement réduit | Le rendu utilise moins de particules, une densité de pixels réduite et une scène fixe afin de limiter la charge. |
| Repli WebGL | Une trame graphique CSS reste visible si le contexte WebGL n’est pas disponible. |
| Administration | Les interfaces de gestion gardent une présentation 2D priorisant les formulaires, la lisibilité et l’efficacité des opérations. |

## Ajustements de cohérence

Les fiches de projets affichent désormais un registre, un profil de système, le nombre de modules techniques et un numéro de dossier. L’administration porte une signature `CONTROL // 01`, un état de lien stable et une désignation explicite de l’opérateur. Les contrôles mobile confirment que le registre s’empile, que les graphiques restent lisibles et que les formulaires conservent une largeur exploitable.

La page d’accueil comporte également un protocole de livraison en trois nœuds et un registre de preuves alimenté par les projets, les compétences et les expériences existants. Les modules se superposent verticalement sur mobile sans perdre leurs repères, tandis que la scène Three.js reste cadrée dans son module de topologie.
