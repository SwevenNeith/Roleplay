// Composant pour afficher et éditer un personnage sous forme de carte
<template>
  <div class="character-card big">
    <!-- Mode affichage simple -->
    <div v-if="!isEditing">
      <!-- En-tête avec les informations de base -->
      <div class="card-header">
        <div class="card-header-name">{{ character.nom }}</div>
        <div class="card-header-details">
          <span>Race : {{ character.race }}</span>
          <span>Classe : {{ character.classe }}</span>
          <span>Joueur : {{ character.joueur }}</span>
          <span>Niveau : {{ character.niveau }}</span>
        </div>
      </div>

      <!-- Barre d'expérience -->
      <div class="xp-bar-container">
        <div class="xp-bar" :style="{ width: xpPercentage + '%' }"></div>
        <span class="xp-label">{{ character.experience }}/{{ maxXP }} XP</span>
      </div>

      <!-- Boutons d'action -->
      <div class="card-buttons">
        <button class="edit-character-btn" @click="startEdit">Modifier</button>
        <button class="delete-character-btn" @click="$emit('delete')">Supprimer</button>
        <button class="view-character-btn" @click="$emit('view')">Voir détails</button>
      </div>
    </div>

    <!-- Mode édition détaillée -->
    <div v-else>
      <CharacterForm
        :initialData="editedCharacter"
        submit-button-text="Enregistrer"
        @submit="saveEditFromForm"
        @cancel="cancelEdit"
      />
    </div>
  </div>
</template>

<script>
import CharacterForm from './CharacterForm.vue';

export default {
  name: 'CharacterCard',
  components: {
    CharacterForm
  },
  // Props reçues du composant parent
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  // État local du composant
  data() {
    return {
      isEditing: false,           // Contrôle le mode d'affichage
      editedCharacter: null,      // Copie de travail du personnage en édition
      maitrisesList: [           // Liste des maîtrises disponibles
        'Acrobaties', 'Arcanes', 'Athlétisme', 'Discrétion', 'Dressage',
        'Escamotage', 'Histoire', 'Intimidation', 'Investigation', 'Médecine',
        'Nature', 'Perception', 'Persuasion', 'Religion', 'Représentation',
        'Survie', 'Tromperie', 'Perception passive', 'Performance', 'Survie urbaine'
      ]
    }
  },
  computed: {
    maxXP() {
      return this.character.niveau * 100;
    },
    xpPercentage() {
      return (this.character.experience / this.maxXP) * 100;
    }
  },
  methods: {
    // Active le mode édition
    startEdit() {
      this.editedCharacter = JSON.parse(JSON.stringify(this.character));
      // Initialise les maîtrises si nécessaire
      if (!this.editedCharacter.maitrises) {
        this.editedCharacter.maitrises = {};
        this.maitrisesList.forEach(m => {
          this.editedCharacter.maitrises[m] = 0;
        });
      }
      // Initialise les compétences si nécessaire
      if (!this.editedCharacter.competences) {
        this.editedCharacter.competences = [];
      }
      this.isEditing = true;
    },
    // Sauvegarde les modifications depuis CharacterForm
    async saveEditFromForm(formData) {
      try {
        const response = await fetch(`http://localhost:3000/api/characters/${this.character._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          this.$emit('update', formData);
          this.isEditing = false;
        }
      } catch (error) {
        console.error('Erreur lors de la modification du personnage:', error);
      }
    },
    // Annule l'édition en cours
    cancelEdit() {
      this.isEditing = false;
      this.editedCharacter = null;
    }
  }
}
</script>

<style scoped>
/* Style de la carte */
.character-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  margin: 0 auto;
}

/* Style du formulaire d'édition */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Style de l'en-tête */
.header-section {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #c8aa6e;
  padding-bottom: 15px;
}

/* Grille des informations de droite */
.header-right {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 1;
}

/* Layout principal en 3 colonnes */
.main-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
  width: 100%;
}

/* Style de la colonne gauche */
.left-column {
  border-right: 1px solid #ddd;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Liste des caractéristiques */
.characteristics-list {
  display: flex;
  flex-direction: column;
  gap: 150px;
  width: 100%;
}

/* Style des boîtes de caractéristiques */
.characteristic-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
}

/* Style de la colonne centrale */
.middle-column {
  padding: 0 20px;
  border-right: 1px solid #ddd;
}

/* Liste des maîtrises */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto;
}

/* Style des éléments de maîtrise */
.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.skill-item input {
  width: 80px;
  text-align: center;
}

/* Style de la colonne droite */
.right-column {
  padding-left: 10px;
  padding-right: 20px;
  padding-top: 100px;
}

/* Stats de combat */
.combat-stats {
  display: flex;
  flex-direction: column;
  gap: 150px;
}

/* Style des boîtes de stats */
.stat-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* Style des points de vie */
.hp-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.hp-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.hp-inputs input {
  width: 80px;
  text-align: center;
}

/* Style de l'en-tête en mode affichage */
.card-header {
  margin-bottom: 15px;
}

.card-header-name {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-header-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Style des boutons d'action */
.card-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

/* Style des boutons */
.edit-character-btn,
.delete-character-btn,
.view-character-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.edit-character-btn { background-color: #2196F3; color: white; }
.delete-character-btn { background-color: #f44336; color: white; }
.view-character-btn { background-color: #c8aa6e; color: white; }

/* Effets de survol des boutons */
.edit-character-btn:hover { background-color: #1976D2; }
.delete-character-btn:hover { background-color: #D32F2F; }
.view-character-btn:hover { background-color: #b89b5f; }

/* Adaptations responsives */
@media (max-width: 1400px) {
  .main-section {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .left-column,
  .middle-column,
  .right-column {
    border: none;
    padding: 0;
  }

  .characteristics-list,
  .skills-list,
  .stat-box,
  .hp-box {
    max-width: 400px;
    margin: 0 auto;
  }
}

/* Style de la barre d'expérience */
.xp-bar-container {
  position: relative;
  height: 14px;
  background: #eee;
  border-radius: 8px;
  margin: 10px 0;
  width: 100%;
  overflow: hidden;
}

.xp-bar {
  height: 100%;
  background: linear-gradient(90deg, #c8aa6e 60%, #2c6578 100%);
  border-radius: 8px 0 0 8px;
  transition: width 0.4s;
}

.xp-label {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.9em;
  color: #2c6578;
  font-weight: bold;
  text-shadow: 0 0 2px white;
}
</style> 