# Documentation des Changements : Carte Interactive et Gestion des Origines

Ce document détaille les modifications techniques apportées pour rendre la carte de Runeterra interactive, responsive et parfaitement alignée, ainsi que les mises à jour du système de gestion des origines.

## 1. Backend (API & Base de Données)

### Modèle `Origine.js`

- **Nouveaux champs** : Ajout de `position_x` et `position_y` (Type: Number) pour stocker les coordonnées de l'origine sur la carte. Ces valeurs sont des pourcentages (0 à 100).
- **Modification** : Le champ `description` n'est plus requis (`required: false`) pour permettre la création rapide d'une origine avec seulement un nom.

### Routes `origineRoutes.js`

- **POST `/api/origins`** : Mise à jour pour accepter et enregistrer `position_x` et `position_y` lors de la création.
- **PUT `/api/origins/:slug`** : Mise à jour pour permettre la modification des coordonnées d'une origine existante.

## 2. Frontend - Gestion des Origines (`OrigineDetails.vue`)

### Formulaire d'édition

- **Nouveaux champs** : Ajout de deux champs numériques pour "Position X" et "Position Y".
- **Contraintes** : Les champs acceptent des valeurs de 0 à 100 (pourcentages) avec une précision décimale.
- **Logique** : Chargement et sauvegarde de ces nouvelles données via l'API.

## 3. Frontend - Carte Interactive (`Map.vue`)

C'est ici que les changements les plus complexes ont eu lieu pour assurer une expérience utilisateur fluide et responsive.

### A. Affichage Dynamique

- La carte n'utilise plus de zones "en dur". Elle charge désormais la liste des origines depuis l'API au démarrage.
- Chaque origine est convertie en un cercle cliquable placé selon ses coordonnées `position_x` et `position_y`.

### B. Responsive Design & Taille des Cercles

- **Unités relatives** : La taille des cercles est définie en `vw` (Viewport Width) pour grandir avec l'écran.
  - Taille actuelle : `3.5vw`.
- **Contraintes Min/Max** : Pour éviter que les cercles ne soient illisibles sur mobile ou énormes sur écran géant :
  - Minimum : `20px`.
  - Maximum : `150px`.

### C. Centrage Parfait (`transform`)

- **Problème** : Par défaut, un élément positionné en CSS (`top: 50%, left: 50%`) place son _coin supérieur gauche_ au point désigné, et non son centre.
- **Solution** : Ajout de `transform: translate(-50%, -50%)`. Cela décale le cercle de la moitié de sa propre taille vers la gauche et le haut. Ainsi, le centre du cercle correspond exactement aux coordonnées.

### D. Alignement Image/Coordonnées (Le "Fix" Grand Écran)

- **Problème** : L'image de fond utilisait `object-fit: cover` (CSS natif) pour remplir l'écran. Cependant, cela coupe l'image différemment selon le ratio de l'écran (16/9, 21/9, 4/3), ce qui décalait les coordonnées des cercles qui eux, restaient relatifs à la fenêtre entière.
- **Solution Technique** : Implémentation d'une logique "Object-Fit Manuel" en JavaScript.
  1. Un conteneur `map-viewport` définit la zone visible.
  2. Un conteneur interne `map-content` contient **à la fois** l'image et les cercles.
  3. Un script calcule en temps réel (et au redimensionnement) les dimensions exactes que doit avoir l'image pour couvrir l'écran tout en gardant son ratio.
  4. Le script applique ces dimensions au `map-content`.

**Résultat** : Le système de coordonnées (le `div` parent des cercles) a toujours exactement la même taille et position que l'image visuelle. Les cercles restent donc parfaitement "collés" à leur emplacement géographique sur la carte, peu importe la taille ou le format de l'écran.
