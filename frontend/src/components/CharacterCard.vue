<template>
  <div class="character-card big">
    <!-- Mode affichage -->
    <div v-if="!isEditing">
      <div class="card-header">
        <div class="card-header-name">{{ character.nom }}</div>
        <div class="card-header-details">
          <span>Race : {{ character.race }}</span>
          <span>Classe : {{ character.classe }}</span>
          <span>Joueur : {{ character.joueur }}</span>
        </div>
      </div>

      <div class="card-buttons">
        <button class="edit-character-btn" @click="startEdit">Modifier</button>
        <button class="delete-character-btn" @click="$emit('delete')">Supprimer</button>
        <button class="view-character-btn" @click="$emit('view')">Voir détails</button>
      </div>
    </div>

    <!-- Mode édition -->
    <div v-else>
      <div class="edit-form">
        <!-- En-tête -->
        <div class="header-section">
          <div class="form-group">
            <label>Nom du personnage :</label>
            <input v-model="editedCharacter.nom" type="text" required>
          </div>
          <div class="header-right">
            <div class="form-group">
              <label>Classe :</label>
              <input v-model="editedCharacter.classe" type="text" required>
            </div>
            <div class="form-group">
              <label>Race :</label>
              <input v-model="editedCharacter.race" type="text" required>
            </div>
            <div class="form-group">
              <label>Joueur :</label>
              <input v-model="editedCharacter.joueur" type="text" required>
            </div>
            <div class="form-group">
              <label>Expérience :</label>
              <input v-model.number="editedCharacter.experience" type="number" min="0" max="100">
            </div>
          </div>
        </div>

        <!-- Corps principal en 3 colonnes -->
        <div class="main-section">
          <!-- Colonne de gauche : Caractéristiques -->
          <div class="left-column">
            <h4>Caractéristiques</h4>
            <div class="characteristics-list">
              <div v-for="(value, carac) in editedCharacter.caracs" :key="carac" class="characteristic-box">
                <label>{{ carac }}</label>
                <input v-model.number="editedCharacter.caracs[carac]" type="number" required>
              </div>
            </div>
          </div>

          <!-- Colonne du milieu : Maîtrises -->
          <div class="middle-column">
            <h4>Maîtrises</h4>
            <div class="skills-list">
              <div v-for="(value, maitrise) in editedCharacter.maitrises" :key="maitrise" class="skill-item">
                <label>{{ maitrise }}</label>
                <input v-model.number="editedCharacter.maitrises[maitrise]" type="number" required>
              </div>
            </div>
          </div>

          <!-- Colonne de droite : Stats et autres -->
          <div class="right-column">
            <div class="combat-stats">
              <div class="stat-box">
                <label>Inspiration</label>
                <input v-model.number="editedCharacter.inspiration" type="number" min="0">
              </div>
              <div class="stat-box">
                <label>Classe d'armure</label>
                <input v-model.number="editedCharacter.armure" type="number" min="0">
              </div>
              <div class="stat-box">
                <label>Initiative</label>
                <input v-model.number="editedCharacter.initiative" type="number">
              </div>
              <div class="stat-box">
                <label>Vitesse</label>
                <input v-model.number="editedCharacter.vitesse" type="number" min="0">
              </div>
              <div class="hp-box">
                <label>Points de vie</label>
                <div class="hp-inputs">
                  <input v-model.number="editedCharacter.pv[0]" type="number" min="0" placeholder="Actuels">
                  <span>/</span>
                  <input v-model.number="editedCharacter.pv[1]" type="number" min="0" placeholder="Maximum">
                </div>
              </div>
              <div class="stat-box">
                <label>Dé de récupération</label>
                <input v-model="editedCharacter.deRecup" type="text">
              </div>
            </div>
          </div>
        </div>

        <!-- Section background -->
        <div class="background-section">
          <h4>Background</h4>
          <textarea v-model="editedCharacter.background" rows="3"></textarea>
        </div>

        <!-- Section compétences -->
        <div class="competences-section">
          <CompetenceForm
            :competences="editedCharacter.competences"
            @add-competence="addCompetence"
            @remove-competence="removeCompetence"
          />
        </div>

        <!-- Boutons -->
        <div class="button-group">
          <button class="btn-save" @click="saveEdit">Enregistrer</button>
          <button class="btn-cancel" @click="cancelEdit">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompetenceForm from './CompetenceForm.vue';

export default {
  name: 'CharacterCard',
  components: {
    CompetenceForm
  },
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editedCharacter: null,
      maitrisesList: [
        'Acrobaties', 'Arcanes', 'Athlétisme', 'Discrétion', 'Dressage',
        'Escamotage', 'Histoire', 'Intimidation', 'Investigation', 'Médecine',
        'Nature', 'Perception', 'Persuasion', 'Religion', 'Représentation',
        'Survie', 'Tromperie', 'Perception passive', 'Performance', 'Survie urbaine'
      ]
    }
  },
  methods: {
    startEdit() {
      this.editedCharacter = JSON.parse(JSON.stringify(this.character));
      // Initialise les maîtrises si elles n'existent pas
      if (!this.editedCharacter.maitrises) {
        this.editedCharacter.maitrises = {};
        this.maitrisesList.forEach(m => {
          this.editedCharacter.maitrises[m] = 0;
        });
      }
      // Initialise les compétences si elles n'existent pas
      if (!this.editedCharacter.competences) {
        this.editedCharacter.competences = [];
      }
      this.isEditing = true;
    },
    async saveEdit() {
      try {
        const response = await fetch(`http://localhost:3000/api/characters/${this.character._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editedCharacter)
        });

        if (response.ok) {
          this.$emit('update', this.editedCharacter);
          this.isEditing = false;
        }
      } catch (error) {
        console.error('Erreur lors de la modification du personnage:', error);
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedCharacter = null;
    },
    addCompetence(competence) {
      this.editedCharacter.competences.push(competence);
    },
    removeCompetence(index) {
      this.editedCharacter.competences.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.character-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  margin: 0 auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* En-tête */
.header-section {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #c8aa6e;
  padding-bottom: 15px;
}

.header-right {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 1;
}

/* Section principale */
.main-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
  width: 100%;
}

/* Colonne de gauche - Caractéristiques */
.left-column {
  border-right: 1px solid #ddd;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.characteristics-list {
  display: flex;
  flex-direction: column;
  gap: 150px;
  width: 100%;
}

.characteristic-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
}

.characteristic-box input {
  width: 75%;
  text-align: center;
}

/* Colonne du milieu - Maîtrises */
.middle-column {
  padding: 0 20px;
  border-right: 1px solid #ddd;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto;
}

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

/* Colonne de droite - Stats */
.right-column {
  padding-left: 10px;
  padding-right: 20px;
  padding-top: 100px;
}

.combat-stats {
  display: flex;
  flex-direction: column;
  gap: 150px;
}

.stat-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.stat-box input {
  width: 75%;
  text-align: center;
  margin: 0 auto;
}

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

/* Background */
.background-section {
  margin-top: 20px;
}

.background-section textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Styles communs */
h4 {
  color: #2c6578;
  margin-bottom: 15px;
  border-bottom: 1px solid #c8aa6e;
  padding-bottom: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

/* Mode affichage */
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

.card-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

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

.edit-character-btn:hover { background-color: #1976D2; }
.delete-character-btn:hover { background-color: #D32F2F; }
.view-character-btn:hover { background-color: #b89b5f; }

/* Ajustements responsifs */
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

/* Boutons */
.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #9e9e9e;
  color: white;
}

.btn-save:hover { background-color: #388E3C; }
.btn-cancel:hover { background-color: #757575; }
</style> 