<template>
  <div class="competence-section">
    <div v-if="!showForm" class="competence-list">
      <h4>Compétences</h4>
      <button class="add-btn" @click="showForm = true">Ajouter une compétence</button>
      <div v-if="competences.length > 0" class="competences-grid">
        <div v-for="(competence, idx) in competences" :key="idx" class="competence-item">
          <div class="competence-header">
            <strong>{{ competence.nom }}</strong>
            <button class="remove-btn" @click="removeCompetence(idx)">×</button>
          </div>
          <div class="competence-details">
            <span>Voie : {{ competence.voie }}</span>
            <span>Type : {{ competence.type }}</span>
          </div>
        </div>
      </div>
      <p v-else class="no-competences">Aucune compétence ajoutée</p>
    </div>

    <div v-else class="competence-form">
      <h4>Nouvelle Compétence</h4>
      <div class="form-group">
        <label>Nom :</label>
        <input v-model="newCompetence.nom" type="text" required>
      </div>
      <div class="form-group">
        <label>Voie :</label>
        <input v-model="newCompetence.voie" type="text" required>
      </div>
      <div class="form-group">
        <label>Type :</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="Attaque" v-model="newCompetence.type">
            Attaque
          </label>
          <label>
            <input type="radio" value="Soin" v-model="newCompetence.type">
            Soin
          </label>
          <label>
            <input type="radio" value="Défense" v-model="newCompetence.type">
            Défense
          </label>
        </div>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div class="button-group">
        <button class="save-btn" @click="addCompetence">Ajouter</button>
        <button class="cancel-btn" @click="cancelAdd">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetenceForm',
  props: {
    competences: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      error: '',
      newCompetence: {
        nom: '',
        voie: '',
        type: ''
      }
    }
  },
  methods: {
    addCompetence() {
      if (!this.newCompetence.nom || !this.newCompetence.voie || !this.newCompetence.type) {
        this.error = 'Veuillez remplir tous les champs';
        return;
      }

      const competence = {
        nom: this.newCompetence.nom,
        voie: this.newCompetence.voie,
        type: this.newCompetence.type,
        slug: this.slugify(this.newCompetence.nom),
        voie_slug: this.slugify(this.newCompetence.voie)
      };

      this.$emit('add-competence', competence);
      this.resetForm();
    },
    removeCompetence(index) {
      this.$emit('remove-competence', index);
    },
    cancelAdd() {
      this.resetForm();
    },
    resetForm() {
      this.newCompetence = {
        nom: '',
        voie: '',
        type: ''
      };
      this.error = '';
      this.showForm = false;
    },
    slugify(str) {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    }
  }
}
</script>

<style scoped>
.competence-section {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
}

.competence-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.competences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.competence-item {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.competence-details {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
}

.remove-btn {
  background-color: transparent;
  color: #f44336;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
}

.error-message {
  color: #f44336;
  margin-top: 5px;
  font-size: 0.9em;
}

.no-competences {
  color: #666;
  font-style: italic;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.9;
}
</style> 