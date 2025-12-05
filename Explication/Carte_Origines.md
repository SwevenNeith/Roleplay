# Documentation Complète : Carte Interactive et Gestion des Origines

Ce document détaille l'ensemble des fonctionnalités du système de carte interactive de Runeterra et de gestion des origines, incluant les modifications récentes et les fonctionnalités existantes.

---

## 1. Backend (API & Base de Données)

### Modèle `Origine.js`

Le modèle Mongoose définit la structure des données pour chaque origine dans MongoDB.

#### Champs du Modèle

- **`slug`** (String, requis, unique) : Identifiant unique de l'origine (ex: "bilgewater")
- **`nom`** (String, requis) : Nom affiché de l'origine (ex: "Bilgewater")
- **`position_x`** (Number, optionnel, défaut: 5) : Position horizontale sur la carte en pourcentage (0-100)
- **`position_y`** (Number, optionnel, défaut: 5) : Position verticale sur la carte en pourcentage (0-100)

#### Champs de Contenu Riche (Nouveaux - Décembre 2024)

Ces champs stockent du HTML généré par l'éditeur Quill pour un affichage enrichi :

- **`themes_majeurs`** (String, optionnel) : Thèmes principaux de l'origine
- **`geographie`** (String, optionnel) : Géographie et lieux importants
- **`histoire`** (String, optionnel) : Histoire résumée de la région
- **`factions`** (String, optionnel) : Factions et organisations présentes
- **`champions`** (String, optionnel) : Champions associés à cette origine
- **`evenements`** (String, optionnel) : Événements majeurs de l'histoire

#### Champs Supprimés (Décembre 2024)

- ~~`description`~~ : Supprimé pour simplifier le modèle
- ~~`traits`~~ : Supprimé (array de strings)
- ~~`regions_associees`~~ : Supprimé (array de strings)

---

### Routes API (`origineRoutes.js`)

#### **GET `/api/origins`**

- Récupère toutes les origines de la base de données
- Utilisé par la carte pour afficher tous les points cliquables

#### **GET `/api/origins/:slug`**

- Récupère une origine spécifique par son slug
- Retourne 404 si l'origine n'existe pas

#### **POST `/api/origins`**

- Crée une nouvelle origine
- Champs requis : `slug`, `nom`
- Champs optionnels : tous les champs de contenu riche et positions
- Retourne 409 si le slug existe déjà

#### **PUT `/api/origins/:slug`**

- Met à jour une origine existante
- Permet la modification de tous les champs (nom, positions, contenu riche)
- Retourne 404 si l'origine n'existe pas

---

## 2. Frontend - Page d'Accueil Runeterra (`RuneterraHomePage.vue`)

### Fonctionnalités

- Affiche une introduction à l'univers de Runeterra
- Permet la création rapide d'une nouvelle origine via un formulaire simple
- Redirige automatiquement vers la page de détails après création pour compléter les informations

---

## 3. Frontend - Carte Interactive (`Map.vue`)

C'est le composant le plus complexe du système, gérant l'affichage responsive et l'interaction avec la carte.

### A. Chargement Dynamique des Origines

- Au montage du composant, appel API `GET /api/origins`
- Conversion de chaque origine en cercle cliquable positionné selon `position_x` et `position_y`
- Navigation vers `OrigineDetails` au clic sur un cercle

### B. Responsive Design & Taille des Cercles

**Unités Relatives :**

- Taille des cercles : `3.5vw` (Viewport Width)
- Les cercles grandissent proportionnellement à la largeur de l'écran

**Contraintes Min/Max :**

- Minimum : `20px` (lisibilité sur mobile)
- Maximum : `150px` (évite les cercles géants sur grands écrans)

### C. Centrage Parfait des Cercles (`transform`)

**Problème Initial :**

- Un élément CSS avec `top: 50%, left: 50%` place son coin supérieur gauche au point désigné, pas son centre
- Résultat : décalage visuel des cercles par rapport aux coordonnées

**Solution Implémentée :**

```css
transform: translate(-50%, -50%);
```

- Décale le cercle de la moitié de sa propre taille vers la gauche et le haut
- Le centre du cercle correspond maintenant exactement aux coordonnées `position_x` et `position_y`

### D. Alignement Image/Coordonnées (Fix Grand Écran)

**Problème Complexe :**

- L'image de fond utilisait `object-fit: cover` (CSS natif)
- Sur différents ratios d'écran (16:9, 21:9, 4:3), l'image est recadrée différemment
- Les coordonnées des cercles restaient relatives à la fenêtre entière
- **Résultat** : Décalage des cercles sur les grands écrans ultra-larges

**Solution Technique : Object-Fit Manuel en JavaScript**

1. **Structure HTML :**

   - `map-viewport` : Zone visible (100vw × calc(100vh - 40px))
   - `map-content` : Conteneur calculé dynamiquement contenant l'image ET les cercles
   - `map-image` : Image de la carte avec `object-fit: fill`

2. **Logique JavaScript (`adjustMapSize()`) :**

   - Calcule le ratio de l'image originale
   - Calcule le ratio de la fenêtre
   - Détermine si l'image doit être plus large ou plus haute pour couvrir l'écran
   - Applique les dimensions exactes au `map-content`
   - Centre le conteneur dans le viewport

3. **Événements :**
   - Exécution au montage du composant
   - Ré-exécution à chaque redimensionnement de fenêtre

**Résultat :**

- Le système de coordonnées (parent des cercles) a toujours exactement la même taille et position que l'image visuelle
- Les cercles restent parfaitement "collés" à leur emplacement géographique
- Fonctionne sur tous les formats d'écran

---

## 4. Frontend - Détails d'une Origine (`OrigineDetails.vue`)

### A. Structure de la Page

**En-tête (Header Section) :**

- Titre : Nom de l'origine
- Bouton "Modifier" / "Ajouter" positionné en haut à droite (comme `CompetenceList.vue`)

**Affichage en Mode Lecture :**

- Utilise le composant `OrigineTemplate.vue` pour afficher le contenu riche

**Formulaire d'Édition (Mode Édition) :**

- Activé via le bouton en haut à droite
- Permet la création ou modification complète d'une origine

### B. Formulaire d'Édition

#### Champ Principal

- **Nom de la région / Origine** : Input texte requis

#### Sections de Contenu Riche (Éditeur Quill)

Chaque section dispose d'un éditeur de texte riche avec les fonctionnalités suivantes :

- **Formatage de texte** : Gras, Italique, Souligné, Barré
- **Couleurs** : Couleur de texte et couleur de surlignage
- **Titres** : H1, H2, H3
- **Listes** : Ordonnées et à puces
- **Nettoyage** : Bouton pour retirer tout formatage

**Sections disponibles :**

1. Thèmes majeurs
2. Géographie et lieux importants
3. Histoire résumée
4. Factions / Organisations
5. Champions associés
6. Événements majeurs

#### Champs de Position (En Bas du Formulaire)

- **Position X (%)** : Nombre de 0 à 100, précision 0.1
- **Position Y (%)** : Nombre de 0 à 100, précision 0.1

### C. Intégration de l'Éditeur Quill

**Bibliothèque Utilisée :**

- `@vueup/vue-quill@beta` (compatible Vue 3)
- Thème : Snow (interface claire et moderne)

**Configuration :**

```javascript
toolbarOptions: [
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ header: [1, 2, 3, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];
```

**Stockage :**

- Type de contenu : `html`
- Le HTML généré est envoyé directement à l'API et stocké en base de données

### D. Logique de Sauvegarde

**Création (POST) :**

- Si l'origine n'existe pas, création via `POST /api/origins`
- Tous les champs sont envoyés, y compris le contenu HTML des éditeurs

**Modification (PUT) :**

- Si l'origine existe, mise à jour via `PUT /api/origins/:slug`
- Permet de modifier le nom, les positions et tout le contenu riche

### E. Layout Full-Width (Décembre 2024)

**Modification :**

- Suppression de `max-width: 900px` et `margin: 0 auto`
- La page occupe maintenant toute la largeur de l'écran
- Cohérent avec le design de `CompetenceList.vue`

---

## 5. Frontend - Template d'Affichage (`OrigineTemplate.vue`)

### Fonctionnalités

Ce composant reçoit un objet `origin` en prop et affiche son contenu de manière structurée.

### Affichage du Contenu Riche

**Utilisation de `v-html` :**

```vue
<div class="ql-editor-content" v-html="origin.themes_majeurs"></div>
```

**Styles Appliqués :**

- Titres de section : Couleur thème `#c8aa6e` avec bordure inférieure
- Contenu HTML : Styles deep pour respecter le formatage Quill
  - Alignements (centre, droite, justifié)
  - Formatage (gras, italique, souligné)

**Sections Conditionnelles :**

- Chaque section n'est affichée que si elle contient du contenu
- Utilisation de `v-if` pour éviter les sections vides

---

## 6. Workflow Complet : De la Carte aux Détails

1. **Utilisateur visite la carte** (`/runeterra/map`)
2. **Chargement des origines** via API
3. **Affichage des cercles** positionnés selon les coordonnées
4. **Clic sur un cercle** → Navigation vers `/runeterra/origine/:slug`
5. **Chargement des détails** via API
6. **Affichage du contenu riche** avec formatage préservé
7. **Option de modification** via le bouton en haut à droite
8. **Édition avec Quill** pour un contenu professionnel
9. **Sauvegarde** et retour à l'affichage

---

## 7. Technologies Utilisées

### Backend

- **Node.js** + **Express** : Serveur API REST
- **MongoDB** + **Mongoose** : Base de données NoSQL

### Frontend

- **Vue.js 3** : Framework JavaScript
- **Vue Router** : Navigation entre pages
- **@vueup/vue-quill** : Éditeur de texte riche
- **Quill Snow Theme** : Interface d'édition

### CSS

- **Responsive Units** : `vw`, `vh`, `%`
- **Flexbox** : Layouts modernes
- **Transform** : Centrage précis des éléments

---

## 8. Améliorations Futures Possibles

- **Upload d'images** dans l'éditeur Quill
- **Prévisualisation en temps réel** lors de l'édition
- **Drag & drop** pour repositionner les origines sur la carte
- **Zoom** sur la carte pour plus de précision
- **Filtres** par thème ou faction sur la carte
- **Historique des modifications** avec versioning
- **Mode sombre** pour l'interface

---

## 9. Résumé des Modifications (Décembre 2024)

### Ajouts Majeurs

✅ Éditeur de texte riche Quill avec 6 sections de contenu  
✅ Stockage HTML en base de données  
✅ Affichage formaté du contenu riche  
✅ Layout full-width pour les détails  
✅ Repositionnement du bouton modifier en haut à droite

### Suppressions

❌ Champ `description` (texte simple)  
❌ Champ `traits` (array)  
❌ Champ `regions_associees` (array)

### Améliorations Existantes Conservées

✅ Carte responsive avec cercles adaptatifs  
✅ Centrage parfait via `transform`  
✅ Alignement image/coordonnées via JavaScript  
✅ API REST complète (CRUD)

---

**Date de dernière mise à jour** : 5 décembre 2024
