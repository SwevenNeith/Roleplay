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

    <CompetenceForm
      v-if="showForm"
      @competence-added="handleCompetenceAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque compétence -->
    <div class="competence-cards-container">
      <CompetenceCard
        v-for="competence in competences"
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
      showForm: false
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