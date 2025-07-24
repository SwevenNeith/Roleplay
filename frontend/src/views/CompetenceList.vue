<!--
  Ce composant affiche la liste des compétences.
  Il permet d'ajouter une compétence.
  Il permet d'annuler l'ajout d'une compétence.
  Il affiche les compétences sous forme de cards.
-->

<template>
  <!-- Conteneur principal de la liste des compétences -->
  <div>
    <div class="header-section">
      <h1>Liste des compétences</h1>
      <button class="btn-add" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : 'Ajouter une compétence' }}
      </button>
    </div>

    <!-- Filtres par thème -->
    <div v-if="allThemes.length" class="theme-filters">
      <label v-for="theme in allThemes" :key="theme" class="theme-checkbox">
        <input type="checkbox" :value="theme" v-model="selectedThemes">
        {{ theme }}
      </label>
    </div>

    <CompetenceForm
      v-if="showForm"
      @competence-added="handleCompetenceAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque compétence -->
    <div class="competence-cards-container">
      <CompetenceCard
        v-for="competence in filteredCompetences"
        :key="competence.slug"
        :competence="competence"
      />
    </div>
  </div>
</template>

<script>
import CompetenceCard from '../components/CompetenceCard.vue';
import CompetenceForm from '../components/CompetenceForm.vue';

export default {
  name: 'CompetenceList',
  components: {
    CompetenceCard,
    CompetenceForm
  },
  data() {
    return {
      competences: [],
      showForm: false,
      selectedThemes: []
    }
  },
  computed: {
    allThemes() {
      // Récupère tous les thèmes uniques présents dans les compétences
      const set = new Set();
      this.competences.forEach(c => (c.theme || []).forEach(t => set.add(t)));
      return Array.from(set);
    },
    filteredCompetences() {
      if (!this.selectedThemes.length) return this.competences;
      return this.competences.filter(c => (c.theme || []).some(t => this.selectedThemes.includes(t)));
    }
  },
  created() {
    this.fetchCompetences();
  },
  methods: {
    async fetchCompetences() {
      try {
        const response = await fetch('http://localhost:3000/api/competences');
        const data = await response.json();
        this.competences = Array.isArray(data) ? data.filter(c => c) : [];
      } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
      }
    },
    handleCompetenceAdded() {
      this.showForm = false;
      this.fetchCompetences();
    }
  }
}
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.theme-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}
.theme-checkbox {
  background: #23233a;
  color: #c8aa6e;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.98em;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid #2c6578;
  transition: background 0.2s;
}
.theme-checkbox input[type="checkbox"] {
  accent-color: #2c6578;
}

.competence-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
}
h1 {
  color: #c8aa6e;
  margin: 0;
}

.btn-add {
  background-color: #2c6578;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-add:hover {
  background-color: #1e4a5a;
}
</style>