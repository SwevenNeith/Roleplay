<template>
  <div class="character-form">
    <div class="edit-form">
      <!-- En-tête -->
      <div class="header-section">
        <div class="form-group">
          <label>Nom du personnage :</label>
          <input v-model="formData.nom" type="text" required>
        </div>
        <div class="header-right">
          <div class="form-group">
            <label>Classe :</label>
            <input v-model="formData.classe" type="text" required>
          </div>
          <div class="form-group">
            <label>Race :</label>
            <input v-model="formData.race" type="text" required>
          </div>
          <div class="form-group">
            <label>Joueur :</label>
            <input v-model="formData.joueur" type="text" required>
          </div>
          <div class="form-group">
            <label>Expérience :</label>
            <input v-model.number="formData.experience" type="number" min="0" max="100">
          </div>
        </div>
      </div>

      <!-- Corps principal en 3 colonnes -->
      <div class="main-section">
        <!-- Colonne de gauche : Caractéristiques -->
        <div class="left-column">
          <h4>Caractéristiques</h4>
          <div class="characteristics-list">
            <div v-for="(value, carac) in formData.caracs" :key="carac" class="characteristic-box">
              <label>{{ carac }}</label>
              <input v-model.number="formData.caracs[carac]" type="number" required>
            </div>
          </div>
        </div>

        <!-- Colonne du milieu : Maîtrises -->
        <div class="middle-column">
          <h4>Maîtrises</h4>
          <div class="skills-list">
            <div v-for="(value, maitrise) in formData.maitrises" :key="maitrise" class="skill-item">
              <label>{{ maitrise }}</label>
              <input v-model.number="formData.maitrises[maitrise]" type="number" required>
            </div>
          </div>
        </div>

        <!-- Colonne de droite : Stats et autres -->
        <div class="right-column">
          <div class="combat-stats">
            <div class="stat-box">
              <label>Inspiration</label>
              <input v-model.number="formData.inspiration" type="number" min="0">
            </div>
            <div class="stat-box">
              <label>Classe d'armure</label>
              <input v-model.number="formData.armure" type="number" min="0">
            </div>
            <div class="stat-box">
              <label>Initiative</label>
              <input v-model.number="formData.initiative" type="number">
            </div>
            <div class="stat-box">
              <label>Vitesse</label>
              <input v-model.number="formData.vitesse" type="number" min="0">
            </div>
            <div class="hp-box">
              <label>Points de vie</label>
              <div class="hp-inputs">
                <input v-model.number="formData.pv[0]" type="number" min="0" placeholder="Actuels">
                <span>/</span>
                <input v-model.number="formData.pv[1]" type="number" min="0" placeholder="Maximum">
              </div>
            </div>
            <div class="stat-box">
              <label>Dé de récupération</label>
              <input v-model="formData.deRecup" type="text">
            </div>
          </div>
        </div>
      </div>

      <!-- Section background -->
      <div class="background-section">
        <h4>Background</h4>
        <textarea v-model="formData.background" rows="3"></textarea>
      </div>

      <!-- Section compétences -->
      <div class="competences-section">
        <CompetenceForm
          :competences="formData.competences"
          @add-competence="addCompetence"
          @remove-competence="removeCompetence"
        />
      </div>

      <!-- Boutons -->
      <div class="button-group">
        <button class="btn-save" @click="saveCharacter">{{ submitButtonText }}</button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import CompetenceForm from './CompetenceForm.vue';

export default {
  name: 'CharacterForm',
  components: {
    CompetenceForm
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({
        nom: '',
        race: '',
        classe: '',
        joueur: '',
        experience: 0,
        caracs: {
          Force: 0,
          Dextérité: 0,
          Constitution: 0,
          Intelligence: 0,
          Sagesse: 0,
          Charisme: 0,
        },
        inspiration: 0,
        maitrises: {},
        armure: 0,
        pv: [0, 0],
        vitesse: 0,
        deRecup: '',
        background: '',
        competences: []
      })
    },
    submitButtonText: {
      type: String,
      default: 'Sauvegarder'
    }
  },
  data() {
    return {
      formData: JSON.parse(JSON.stringify(this.initialData)),
      maitrisesList: [
        'Acrobaties', 'Arcanes', 'Athlétisme', 'Discrétion', 'Dressage',
        'Escamotage', 'Histoire', 'Intimidation', 'Investigation', 'Médecine',
        'Nature', 'Perception', 'Persuasion', 'Religion', 'Représentation',
        'Survie', 'Tromperie', 'Perception passive', 'Performance', 'Survie urbaine'
      ]
    }
  },
  created() {
    // Initialise les maîtrises si elles n'existent pas
    if (!this.formData.maitrises || Object.keys(this.formData.maitrises).length === 0) {
      this.formData.maitrises = {};
      this.maitrisesList.forEach(m => {
        this.formData.maitrises[m] = 0;
      });
    }
  },
  methods: {
    addCompetence(competence) {
      this.formData.competences.push(competence);
    },
    removeCompetence(index) {
      this.formData.competences.splice(index, 1);
    },
    saveCharacter() {
      this.$emit('submit', this.formData);
    }
  }
}
</script>

<style scoped>
.character-form {
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

.characteristic-box label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
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
</style> 