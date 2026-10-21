# Minerite Companion · première version stable

**1.42.0 · Stable · 2026-10-20**

Minerite Companion est un mod client communautaire qui rassemble les outils de minage, les recettes et les informations de Minerite dans une interface personnalisable. Cette première version stable présente l’ensemble des fonctionnalités disponibles : 26 modules, des menus du serveur repensés, un wiki intégré et des outils pour adapter votre affichage à votre façon de jouer.

## Installation et premiers pas

- Prérequis : Minecraft Java 26.2, Java 25, Fabric Loader 0.19.0 ou plus récent et Fabric API pour Minecraft 26.2. Le mod s’installe uniquement côté client.
- Téléchargez minerite-companion-1.42.0+26.2.jar dans les fichiers de cette publication et placez-le dans le dossier mods de votre instance Fabric. Retirez l’ancien JAR du Companion si vous en avez déjà un, puis lancez le jeu.
- En jeu, Maj droite ouvre les modules. Utilisez la recherche ou les catégories pour trouver un outil : son interrupteur l’active, sa carte donne accès à ses réglages. Le Companion est aussi accessible depuis les menus d’accueil et de pause.
- Commencez par choisir votre thème, puis ouvrez Modifier le HUD pour placer les panneaux. Tous les raccourcis peuvent être changés dans les réglages ; une configuration existante est conservée.

## Minage et progression

- Session de minage : suivi de la durée, des objets obtenus, des gains reçus et des gains par heure, avec pause et historique des sessions. Les gains reposent sur les messages de paiement reconnus du serveur.
- Taux de découverte : consultez la répartition des objets obtenus. Les pourcentages sont calculés à partir de vos observations ; ils ne représentent pas les taux officiels du serveur.
- Objectifs d’évolution : les conditions présentes dans la description de la pioche tenue sont affichées dans un panneau de progression, pour suivre les objectifs restants sans rouvrir sa description.
- Alertes de minerais : choisissez individuellement les minerais à signaler lorsqu’ils sont mis au jour. Le catalogue propose une recherche et des filtres pour les minerais personnalisés, classiques ou sélectionnés.
- Compteurs du serveur : affichez le solde, les gemmes et le prestige dans des panneaux déplaçables, à partir des informations reçues du serveur.

## Recettes et fabrication

- Calculateur de fabrication : choisissez une recette et une quantité cible pour connaître les matériaux nécessaires. Épinglez un objectif sur le HUD afin de suivre les ingrédients disponibles et manquants.
- Stockages mémorisés : le calculateur peut tenir compte des contenus connus du coffre de l’Ender et des shulkers. Ouvrez ces stockages pour actualiser les données ; leur contenu n’est pas récupéré à distance en permanence.
- Navigateur de recettes : une grille sur le côté droit de l’inventaire permet de rechercher les recettes personnalisées reçues du serveur et certaines conversions utiles de lingots et blocs, sans afficher tout le catalogue vanilla.
- Recherche par rareté : retrouvez les recettes avec leur nom ou une rareté comme primordial, même lorsque celle-ci est affichée sous forme de glyphe reconnu dans le nom de l’objet.
- Établi personnalisé /craft : consultez les recettes connues du client et leurs ingrédients, remplissez la grille si vous disposez des bons objets, puis utilisez Fabriquer au maximum lorsque le résultat est prêt. Les variantes personnalisées et les quantités requises sont vérifiées ; la fabrication reste traitée par le serveur.

## Wiki Minerite intégré

- Parcourez les pioches, les prestiges, les minerais et les recettes dans des fiches classées, avec recherche, filtres par monde et favoris.
- Les fiches expliquent les conditions d’évolution et les récompenses documentées. Les icônes et modèles Minerite sont utilisés lorsqu’ils sont disponibles.
- Le contenu provient du wiki Minerite Community. Chaque fiche conserve sa source et le catalogue indique la date de son relevé ; il reste consultable hors ligne, mais peut prendre du retard sur les changements du serveur.
- Les fiches de recettes compatibles donnent accès au calculateur de fabrication. Le guide du Companion permet également de retrouver le wiki et les principaux réglages.

## Menus du serveur et hôtel des ventes

- Interfaces personnalisées pour les destinations, la boutique, l’index des minerais et ses catégories, les améliorations de pioche, les prestiges, /sell, /autosell, /baltop et le coffre de l’Ender.
- Les améliorations regroupent chaque statistique autour de son action utile : coût en niveaux ou niveau maximal atteint. La réapplication des statistiques dispose d’une action séparée.
- Hôtel des ventes : parcourez les annonces et vos objets en vente avec une recherche et un panneau de détails. Les pages du serveur se chargent en arrière-plan pendant la consultation pour étendre la recherche aux annonces collectées.
- Avant d’ouvrir une annonce mémorisée, le mod retrouve sa page et vérifie l’objet, sa quantité, son vendeur, son prix et ses métadonnées. Une annonce périmée peut être refusée ; le cache ne garantit pas qu’elle soit encore disponible.
- Les achats et sélecteurs de quantité ont leurs propres présentations. Les boutons déclenchent les actions du vrai menu serveur : le mod ne remplace pas ses règles, prix, délais ou confirmations.
- F6 permet de retrouver le menu d’origine et F8 de choisir une présentation dans les menus concernés. Les interfaces du serveur peuvent être désactivées globalement ou par catégorie.

## Inventaire et raccourcis personnels

- Inventaire personnalisé : présentation des emplacements d’équipement, de fabrication, de stockage et de la barre rapide, avec aperçu du personnage et opacité réglable.
- Aperçu interactif des shulkers : maintenez Maj sur une shulker pour inspecter son contenu connu et survoler les objets du panneau. Relâchez Maj pour revenir à l’inventaire. Le mod n’invente pas le contenu des boîtes dont les données sont inconnues.
- Boutons d’inventaire : placez vos propres raccourcis autour de l’inventaire et choisissez leur libellé, leur icône, la commande exécutée, la taille, le thème et le style.
- Organisez les boutons dans plusieurs profils, dupliquez une disposition et utilisez la grille d’aimantation pour les aligner. Des raccourcis Minerite sont proposés au départ.

## HUD et affichage en jeu

- Éditeur du HUD : déplacez et redimensionnez les panneaux, réglez leur apparence et utilisez l’aimantation, les repères et les boutons d’alignement pour organiser l’écran.
- Widgets utilitaires : compteur de FPS, coordonnées, direction et angles de vue, ainsi qu’un aperçu de l’inventaire à afficher en maintenant sa touche.
- Barre d’accès rapide : taille et espacement des cases, forme, opacité, compteurs d’objets, emplacement de la seconde main et animation de sélection configurables.
- État du joueur : santé, faim, armure et expérience dans une présentation compacte ou complète, adaptée à la barre rapide.
- Liste des joueurs et noms en jeu : affichage personnalisé conservant les informations de rang et icônes fournies par le serveur. Les noms disposent de réglages de taille, de fond et de distance.
- Tchat : fond réglable jusqu’à 0 % d’opacité, espacement des lignes, en-tête et animations de fondu configurables. Les messages et interactions restent ceux de Minecraft.

## Apparence, viseur et zoom

- Atelier de pioches : choisissez un modèle et ajustez sa taille, sa position, ses rotations, son éclat et son animation. L’aperçu avec votre personnage permet de vérifier le résultat ; des profils et réglages par modèle sont disponibles.
- Textures des minerais : personnalisez l’apparence des minerais et leurs icônes individuellement. Les réglages concernent le rendu local et ne changent pas les objets du serveur.
- Bordures de rareté : réglez séparément les contours, leur intensité, les coins au survol et le fond de sélection des objets.
- Surbrillance des blocs : adaptez les contours et couleurs du bloc visé. Le studio de viseur propose forme, écart, épaisseur, contour et couleur, avec des réglages distincts selon la cible.
- Zoom progressif : maintenez C pour zoomer et utilisez la molette pendant le zoom pour ajuster le grossissement. Relâchez la touche pour revenir progressivement à la vue normale.
- Garde-robe : Cosmetica est inclus pour l’accès aux cosmétiques. La disponibilité du catalogue et des apparences dépend aussi de son service et des données des joueurs.

## Thèmes, dispositions et navigation

- Accueil, navigateur de serveurs et menu de pause personnalisés. Le navigateur permet de retrouver vos serveurs, d’en enregistrer en favoris et de consulter leur état et leur ping.
- Dix thèmes : Obsidienne, Graphite, Minuit, Clair, Ardoise, Améthyste, Moka, Forêt, Rose noire et Abysses, avec couleur d’accent personnalisable.
- Huit dispositions du hub : Classique, Compacte, Centrée, Liste, Galerie, Avec inspecteur, Rail d’icônes et Panoramique.
- Sept styles de cartes : Plein, Verre fumé, Contour, Texte seul, Ligne, Accent latéral et Dégradé. Les préférences par module permettent notamment de choisir un nom, une couleur, un style et un favori.
- Réglez les arrondis, l’opacité, l’assombrissement du fond, les descriptions, les icônes et le contraste. Les transitions d’ouverture, de fermeture et de changement d’écran, le défilement progressif et les infobulles disposent de préférences dédiées.

## Commandes et touches utiles

- Raccourcis par défaut : Maj droite ouvre les modules ; F8 ouvre les sessions de minage ; F9 les alertes de minerais ; F10 l’éditeur du HUD ; C active le zoom tant que la touche reste enfoncée. F8 a une fonction de présentation dans certains menus serveur.
- Roue de commandes : configurez huit raccourcis pour lancer vos commandes habituelles sans les retaper. Sa touche et le contenu de chaque entrée sont modifiables.
- Angles enregistrés : mémorisez une orientation et une inclinaison, puis retrouvez-les avec le raccourci associé.
- Marche et minage automatiques : le module peut maintenir l’avancée et/ou le minage, avec une orientation de départ facultative. J l’active ou l’arrête par défaut ; ses actions et sa touche sont configurables.
- Consultez Raccourcis pour connaître les touches réellement affectées dans votre profil, les modifier et repérer les conflits. Une ancienne configuration conserve ses propres affectations.

## Mises à jour, notes de version et sources

- Au lancement, le Companion recherche les publications compatibles du dépôt officiel et propose une mise à jour lorsqu’une version plus récente existe. Vous pouvez accepter ou reporter, et désactiver cette vérification.
- Après votre accord, le JAR est téléchargé et vérifié par SHA-256. L’installateur attend la fermeture de Minecraft, sauvegarde l’ancienne version et conserve vos réglages ; la nouvelle version est chargée au lancement suivant.
- Le Mode développeur est désactivé par défaut : seules les versions stables sont proposées. Activez-le pour recevoir également les bêtas.
- Le journal des versions est accessible dans Réglages → Aide et raccourcis → Notes de version, ainsi que sur le site du projet. Les sources et le suivi des problèmes sont publics sur ce dépôt GitHub.
- Minerite Companion est un projet communautaire indépendant de l’équipe Minerite. Les outils serveur utilisent les informations reçues par le client et les menus ouverts ; ils ne donnent pas accès à une API privée ni à des données de joueur non reçues.

## Correctifs de cette stable et limites connues

- Correction des annonces AH d’autres pages rejetées à cause du marqueur temporaire du menu ; les autres contrôles d’identité sont conservés. Correction de la disponibilité des recettes confondant des variantes personnalisées.
- Correction des petits boutons et de l’état des pings du navigateur, ainsi que du rechargement de ressources déclenché pendant la fermeture après observation d’un crash natif FreeType.
- Cette stable reprend les corrections des bêtas sur les compteurs de minage, les sauvegardes, les stockages mémorisés, la pagination, les téléchargements et les performances.
- Validation : 24 programmes de vérification automatisés, compilation GitHub réussie et essais en jeu sur Minerite. Les achats réels, la fabrication maximale sur le serveur et le maintien prolongé de Maj dans les aperçus n’ont pas été entièrement validés manuellement.
- À petite résolution, des panneaux HUD déjà placés peuvent se chevaucher : ajustez leur taille et leur position dans l’éditeur. Des avertissements liés à un ancien pack local et à des signatures de textures Cosmetica ont été observés ; le détail de la validation figure dans RELEASE_READINESS.md.

[Journal des versions](https://spirtysprite.github.io/minerite-companion/) · Minecraft 26.2 · Fabric · Java 25


## Extensions · prochaine version majeure, API v1 en bêta

Catalogue d’extensions Lua approuvées avec recherche, catégories, permissions et vérification SHA-256. Installation, mises à jour, activation, désactivation et rechargement sans redémarrage. Les modules d’extension apparaissent dans le hub du Companion et disposent de leurs propres réglages.

API pour les événements, minuteries, touches, données client, commandes déclarées, HUD, écrans structurés, préréglages d’apparence et stockage local. Projets locaux rechargeables en mode développeur ; exemple et documentation : https://plugins.voidwake.fr/minerite-companion/developers. Les bibliothèques Java et les mixins ne sont pas pris en charge par ces extensions à chaud. Cette fonctionnalité n’est pas incluse dans la stable 1.45.0.


API Java native : SDK indépendant des sources privées, projet Gradle autonome et guide https://plugins.voidwake.fr/minerite-companion/java-api. Modules, réglages, événements, HUD natif, écrans et services UI du Companion, avec accès direct à Minecraft et Fabric. Installation manuelle des JAR avec redémarrage dans cette préversion ; le catalogue à installation immédiate reste réservé à Lua. Les callbacks gérés respectent la désactivation, les mixins et événements Fabric indépendants doivent la gérer eux-mêmes.


Contrat Java : chaque extension contrôle ses propres modules. Les thèmes et dispositions HUD sont personnalisables via des remplacements visuels temporaires, sans modifier le fonctionnement des modules intégrés ni écraser la disposition personnelle. Les sources des extensions proposées doivent respecter ce périmètre ; Java natif ne constitue pas un bac à sable.
