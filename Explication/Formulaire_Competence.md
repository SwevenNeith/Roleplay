# Explication des Modifications : Formulaire de Compétence (Système D&D)

Ce document détaille les modifications apportées au projet pour supporter le système de compétences D&D, ainsi que le raisonnement derrière chaque choix technique.

## 1. Backend : Modèle de Données (`backend/models/Competence.js`)

### Objectif

Permettre le stockage des informations spécifiques à D&D sans casser la compatibilité avec les compétences existantes.

### Modifications

- **Extension du Schéma Mongoose** : Nous avons ajouté de nombreux champs optionnels au schéma `competenceSchema`.
  - _Pourquoi ?_ MongoDB est flexible (NoSQL). Ajouter des champs qui ne sont pas utilisés par toutes les compétences n'a pas d'impact négatif majeur et permet d'avoir un seul modèle unifié.
- **Suppression de l'Enum pour `type_action`** :
  - _Avant_ : `enum: ['Action', 'Action Bonus', ...]`
  - _Après_ : `type: String` (plus de restriction stricte).
  - _Raisonnement_ : Vous avez demandé la possibilité de saisir une valeur personnalisée ("Autre"). Une validation stricte par Enum côté base de données empêcherait de sauvegarder ces valeurs libres. La validation se fait désormais implicitement via l'interface utilisateur.

## 2. Frontend : Formulaire (`frontend/src/components/CompetenceForm.vue`)

### A. Gestion de l'Affichage (Visibilité)

- **Logique de "Système"** :
  - Nous avons remplacé le menu déroulant unique par des **checkboxes mutuellement exclusives**.
  - _Fonction `updateSystem(value)`_ : Cette fonction gère la logique "radio" (une seule sélection à la fois) mais permet aussi la **désélection** (cliquer sur l'option active la décoche), ce qui n'est pas possible avec des boutons radio standards.
- **Affichage Conditionnel (`v-if`)** :
  - Le formulaire est divisé en blocs.
  - `v-if="formData.systeme === 'D&D'"` : Affiche le formulaire spécifique D&D.
  - `v-if="['Chroniques Oubliées', 'Mixte'].includes(...)"` : Affiche un message d'attente.
  - Les anciens champs sont masqués tant que le système n'est pas sélectionné ou s'il est différent de l'ancien système par défaut.

### B. Structure du Formulaire D&D

Le formulaire a été découpé en 6 sections distinctes (`.form-section`) pour la clarté, avec des styles CSS pour les distinguer visuellement (bordures, fond sombre).

1.  **Champs "Autre" avec Précision** :

    - Pour les dropdowns comme "Type" ou "Type d'action", nous avons ajouté une logique :
      - Si la valeur sélectionnée est "Autre", un `<input>` texte s'affiche juste en dessous.
      - _Dans le code (`data`)_ : Nous utilisons des variables temporaires `type_custom` et `type_action_custom` pour stocker la saisie de l'utilisateur sans polluer la valeur du dropdown tant qu'on n'a pas sauvegardé.
      - _À la sauvegarde (`saveCompetence`)_ : Si "Autre" est sélectionné, on remplace la valeur envoyée au serveur par le contenu du champ custom.
      - _Au chargement (`created`)_ : Si la valeur reçue du serveur ne fait pas partie de la liste standard, on sélectionne "Autre" dans le dropdown et on remplit le champ custom avec la valeur.

2.  **Champs Conditionnels Imbriqués** :
    - **Jet d'attaque / Modificateur** : Le dropdown "Modificateur" n'apparaît que si un "Jet d'attaque" est choisi.
    - **Durée** : L'input pour préciser la durée (ex: "Nombre de rounds") n'apparaît que si le type de durée correspondant ("X rounds", "Concentration", "Fixe") est sélectionné.
    - _Style_ : Ces inputs conditionnels sont placés dans des conteneurs `flex-column` pour qu'ils prennent toute la largeur disponible, assurant une uniformité visuelle.

### C. Styles CSS

- **Uniformisation** : Tous les `input`, `select`, et `textarea` partagent le même style de base (padding, bordures, couleurs) pour une cohérence parfaite.
- **Espacement** : Utilisation généreuse de `gap` dans les flexbox et de `margin-bottom` pour aérer le formulaire et le rendre plus lisible.

## Résumé pour reproduction future

Si vous devez ajouter un nouveau système (ex: "Chroniques Oubliées") :

1.  Ajoutez la valeur dans le modèle Backend si nécessaire (déjà fait pour CO).
2.  Dans `CompetenceForm.vue`, créez une nouvelle `div` avec `v-if="formData.systeme === 'Chroniques Oubliées'"`.
3.  Copiez la structure HTML d'une section existante (`.form-section`) pour garder le style.
4.  Ajoutez les champs spécifiques dans `data()`.
5.  Assurez-vous de les réinitialiser dans `resetForm()`.
