# Explication Complète : Formulaire de Compétence

Ce document détaille l'implémentation complète du système de compétences avec support multi-systèmes (D&D et Chroniques Oubliées).

## Vue d'ensemble

Le formulaire de compétence permet de créer et modifier des compétences pour deux systèmes de jeu différents :

- **D&D** : Formulaire structuré avec 6 sections détaillées
- **Chroniques Oubliées** : Formulaire simplifié avec champs spécifiques
- **Mixte** : Non implémenté (affiche un message d'erreur)

## Architecture

### 1. Backend : Modèle de Données (`backend/models/Competence.js`)

#### Champs Communs

Utilisés par tous les systèmes :

```javascript
nom: String (obligatoire)
slug: String (unique, généré automatiquement)
systeme: String (D&D, Chroniques Oubliées, Mixte)
voie_slug: String (optionnel)
type: String
description: String
niveau: Number (1-5)
theme: [String]
composant: [String]
```

#### Champs Spécifiques D&D

```javascript
// Informations générales
ecole_magie: String
type_action: String (sans enum pour permettre "Autre")

// Coûts et activation
condition_declenchement: String
composante_materielle_details: String
composante_materielle_consommee: Boolean

// Portée & Cibles
portee_type: String
portee_distance: String
zone_type: String
zone_taille: String
cible_type: String
cible_nombre: Number

// Jets requis
jet_attaque_type: String
jet_attaque_modificateur: String
sauvegarde_attribut: String
sauvegarde_reussite: String
sauvegarde_effet_reduit: String
degre_difficulte: String

// Effets
effet_principal: String
degats_formule: String
degats_type: String
effets_secondaires: [String]
effets_secondaires_repousse_distance: String
effets_secondaires_autre: String
duree_type: String
duree_valeur: String
concentration: Boolean
dissipable: Boolean
notes_lore: String
```

#### Champs Spécifiques Chroniques Oubliées

```javascript
co_type_action: String
co_type_action_autre: String (pour "Autre")
co_conditions: String
co_frequence: String
co_frequence_valeur: String (pour "X fois/jour" et "Autre")
co_jets: String
co_portee: String
co_duree: String
```

#### Pourquoi `strict: false` ?

Le schéma Mongoose utilise `{ strict: false }` pour permettre une flexibilité future sans casser les données existantes.

---

### 2. Frontend : Formulaire (`frontend/src/components/CompetenceForm.vue`)

## Logique de Visibilité

### Sélection du Système

- **Checkboxes mutuellement exclusives** : Implémentées comme des checkboxes mais avec comportement radio
- **Fonction `updateSystem(value)`** :
  - Si le système cliqué est déjà sélectionné → désélection
  - Sinon → sélection du nouveau système
  - Permet la désélection (impossible avec des radio buttons standards)

### Affichage Conditionnel

```vue
<!-- Nom et Système : toujours visibles -->
<input v-model="formData.nom">
<div class="checkbox-group">
  <!-- Checkboxes système -->
</div>

<!-- Formulaire D&D -->
<div v-if="formData.systeme === 'D&D'" class="dnd-form">
  <!-- 6 sections détaillées -->
</div>

<!-- Formulaire Chroniques Oubliées -->
<div v-if="formData.systeme === 'Chroniques Oubliées'" class="co-form">
  <!-- Champs structurés -->
</div>

<!-- Message pour Mixte -->
<div v-if="formData.systeme === 'Mixte'" class="info-message">
  <p>La création du formulaire de ce système est en cours...</p>
</div>
```

---

## Gestion des Champs "Autre"

### Principe

Certains dropdowns ont une option "Autre" qui affiche un champ de saisie libre.

### Implémentation

#### 1. Dans le Template

```vue
<select v-model="formData.type">
  <option value="Sort">Sort</option>
  <option value="Autre">Autre</option>
</select>
<input
  v-if="formData.type === 'Autre'"
  v-model="formData.type_custom"
  placeholder="Préciser le type"
>
```

#### 2. Dans `data()`

```javascript
formData: {
  type: '',
  type_custom: '', // Champ temporaire
  // ...
}
```

#### 3. Lors de la Sauvegarde (`saveCompetence`)

```javascript
// Si "Autre" est sélectionné, remplacer par la valeur custom
if (dataToSend.type === "Autre") {
  dataToSend.type = dataToSend.type_custom;
}
// Supprimer le champ temporaire
delete dataToSend.type_custom;
```

#### 4. Lors du Chargement (`created`)

```javascript
// Si la valeur n'est pas dans la liste standard
const standardTypes = ["Sort", "Action spéciale", ...];
if (this.formData.type && !standardTypes.includes(this.formData.type)) {
  this.formData.type_custom = this.formData.type;
  this.formData.type = "Autre";
}
```

**Champs concernés** :

- D&D : `type`, `type_action`
- CO : `co_type_action`

---

## Validation et Filtrage des Données

### Validations (`saveCompetence`)

#### 1. Validation du Nom

```javascript
if (!this.formData.nom) {
  alert("Veuillez remplir le nom de la compétence.");
  return;
}
```

#### 2. Validation du Système

```javascript
if (!this.formData.systeme) {
  alert("Veuillez sélectionner un système pour la compétence.");
  return;
}
```

#### 3. Blocage du Système Mixte

```javascript
if (this.formData.systeme === "Mixte") {
  alert("Le système 'Mixte' n'est pas encore disponible...");
  return;
}
```

### Filtrage des Données

#### 1. Suppression des Champs par Système

```javascript
const dndFields = ['ecole_magie', 'type_action', ...];
const coFields = ['co_type_action', 'co_conditions', ...];

if (dataToSend.systeme === 'D&D') {
  // Supprimer tous les champs CO
  coFields.forEach(field => delete dataToSend[field]);
} else if (dataToSend.systeme === 'Chroniques Oubliées') {
  // Supprimer tous les champs D&D
  dndFields.forEach(field => delete dataToSend[field]);
}
```

**Pourquoi ?** Pour éviter d'enregistrer des champs vides non pertinents dans la base de données.

#### 2. Suppression des Valeurs Vides

```javascript
Object.keys(dataToSend).forEach((key) => {
  const value = dataToSend[key];
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  ) {
    delete dataToSend[key];
  }
});
```

**Résultat** : Seuls les champs remplis sont envoyés à la base de données.

---

## Structure du Formulaire D&D

### Partie 1 : Informations Générales

- **Type** : Dropdown avec option "Autre" + input conditionnel
- **Niveau** : 1-9
- **École de magie** : Input avec datalist (suggestions)
- **Tags** : Réutilise le champ `theme`

### Partie 2 : Coûts et Activation

- **Type d'action** : Dropdown avec "Autre" + input conditionnel
- **Condition de déclenchement** : Affiché si "Réaction" sélectionnée
- **Composantes** : Checkboxes (Verbal, Somatique, Matériel)
  - Si Matériel : champs pour détails et case "Consommée ?"

### Partie 3 : Portée & Cibles

- **Portée** : Dropdown
  - Si "Distance fixe" ou "Rayon" : input pour distance
- **Zone d'effet** : Dropdown
  - Si sélectionné : input pour taille
- **Cible** : Dropdown
  - Si "Plusieurs" : input pour nombre

### Partie 4 : Jet requis

- **Jet d'attaque** : Dropdown (Corps à Corps, À distance, Magique)
  - Si sélectionné : dropdown Modificateur
- **Test de Sauvegarde** : Dropdown (INT, SAG, FOR, DEX, CON, CHA)
  - Si sélectionné : dropdown Résultat en cas de réussite
    - Si "Effet réduit" : input pour préciser
- **Degré de Difficulté** : Input libre

### Partie 5 : Effets

- **Effet principal** : Textarea
- **Dégâts** : Formule + Type
- **Effets secondaires** : Checkboxes inline
  - Inputs conditionnels en dessous (Distance de repoussement, Autre)
- **Durée** : Dropdown
  - Inputs conditionnels selon sélection (X rounds, Concentration, Fixe)
- **Peut être dissipé ?** : Radio Oui/Non

### Partie 6 : Notes & Lore

- **Description narrative** : Textarea

---

## Structure du Formulaire Chroniques Oubliées

### Champs

1. **Rang** : Dropdown 1-5 (stocké dans `niveau`)
2. **Effet exact** : Textarea (stocké dans `description`)
3. **Type d'action** : Dropdown avec "Autre" + input conditionnel
4. **Conditions d'usage** : Textarea
5. **Fréquence** : Dropdown avec inputs conditionnels pour "X fois/jour" et "Autre"
6. **Jets nécessaires** : Textarea
7. **Portée** : Input
8. **Durée** : Input

---

## Styles CSS

### Classes Principales

- `.dnd-form`, `.co-form` : Conteneurs flex avec gap de 20px
- `.form-section` : Sections avec fond sombre, bordure, padding
- `.form-group` : Groupes de champs avec gap et margin-bottom
- `.info-message` : Message centré avec style italique

### Espacement

- Gap entre sections : 20px
- Gap dans form-group : 12px
- Margin-bottom form-group : 15px
- Padding form-section : 20px

---

## Reproduction pour un Nouveau Système

Pour ajouter un nouveau système (ex: "Pathfinder") :

### 1. Backend

```javascript
// Dans Competence.js
systeme: {
  type: String,
  enum: [..., 'Pathfinder']
}

// Ajouter les champs spécifiques
pf_field1: { type: String },
pf_field2: { type: Number },
// ...
```

### 2. Frontend - Template

```vue
<div v-if="formData.systeme === 'Pathfinder'" class="pf-form">
  <div class="form-section">
    <h3>Section 1</h3>
    <div class="form-group">
      <label>Champ 1 :</label>
      <input v-model="formData.pf_field1">
    </div>
  </div>
</div>
```

### 3. Frontend - Data

```javascript
data() {
  return {
    formData: {
      // ... champs existants
      pf_field1: '',
      pf_field2: '',
    }
  }
}
```

### 4. Frontend - ResetForm

```javascript
resetForm() {
  this.formData = {
    // ... champs existants
    pf_field1: '',
    pf_field2: '',
  };
}
```

### 5. Frontend - SaveCompetence

```javascript
const pfFields = ["pf_field1", "pf_field2"];

if (dataToSend.systeme === "D&D") {
  coFields.forEach((field) => delete dataToSend[field]);
  pfFields.forEach((field) => delete dataToSend[field]);
} else if (dataToSend.systeme === "Chroniques Oubliées") {
  dndFields.forEach((field) => delete dataToSend[field]);
  pfFields.forEach((field) => delete dataToSend[field]);
} else if (dataToSend.systeme === "Pathfinder") {
  dndFields.forEach((field) => delete dataToSend[field]);
  coFields.forEach((field) => delete dataToSend[field]);
}
```

---

## Points Clés à Retenir

1. **Flexibilité** : Le système supporte facilement l'ajout de nouveaux systèmes de jeu
2. **Propreté des données** : Seuls les champs pertinents et remplis sont sauvegardés
3. **Validation** : Empêche la création de compétences incomplètes ou invalides
4. **Réutilisation** : Les champs communs (`nom`, `niveau`, `description`) sont partagés
5. **UX** : Affichage conditionnel pour ne montrer que les champs pertinents
6. **Extensibilité** : Architecture prête pour "Autre" personnalisé sur n'importe quel dropdown
