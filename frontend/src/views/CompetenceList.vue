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
      <div>
        <!-- Bouton pour afficher/masquer le formulaire d'ajout -->
        <button class="btn-add" @click="showForm = !showForm">
          {{ showForm ? 'Annuler' : 'Ajouter une compétence' }}
        </button>
        <!-- Bouton pour activer le mode suppression (affiche les cases à cocher) -->
        <button class="btn-delete" v-if="!modeSuppression" @click="modeSuppression = true">Supprimer</button>
        <!-- Bouton pour quitter le mode suppression -->
        <button class="btn-cancel" v-if="modeSuppression" @click="cancelSuppression">Annuler</button>
      </div>
    </div>

    <!-- Filtres par thème -->
    <div v-if="allThemes.length" class="theme-filters">
      <label v-for="theme in allThemes" :key="theme" class="theme-checkbox">
        <input type="checkbox" :value="theme" v-model="selectedThemes">
        {{ theme }}
      </label>
    </div>

    <!-- Barre de suppression groupée (visible seulement en mode suppression et si au moins une compétence est sélectionnée) -->
    <div v-if="modeSuppression && selectedSlugs.length" class="delete-bar">
      <span>{{ selectedSlugs.length }} sélectionnée(s)</span>
      <!-- Bouton pour supprimer toutes les compétences sélectionnées -->
      <button class="btn-delete" @click="deleteSelected">Supprimer</button>
    </div>

    <CompetenceForm
      v-if="showForm"
      @competence-added="handleCompetenceAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque compétence -->
    <div class="competence-cards-container">
      <div v-for="competence in filteredCompetences" :key="competence.slug" class="competence-card-wrapper">
        <!-- Case à cocher pour la sélection (visible uniquement en mode suppression) -->
        <input v-if="modeSuppression" type="checkbox" class="select-checkbox" :value="competence.slug" v-model="selectedSlugs">
        <CompetenceCard
          :competence="competence"
        />
      </div>
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
      selectedThemes: [],
      selectedSlugs: [], // Liste des slugs sélectionnés pour suppression
      modeSuppression: false // Contrôle l'affichage du mode suppression
    }
  },
  computed: {
    allThemes() {
      // Récupère tous les thèmes uniques présents dans les compétences et les trie par ordre alphabétique
      const set = new Set();
      this.competences.forEach(c => (c.theme || []).forEach(t => set.add(t)));
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    },
    filteredCompetences() {
      let competences = this.competences;
      if (this.selectedThemes.length) {
        competences = competences.filter(c => (c.theme || []).some(t => this.selectedThemes.includes(t)));
      }
      // Trie les compétences par nom (ou autre propriété pertinente) par ordre alphabétique
      return competences.slice().sort((a, b) => {
        if (!a.nom || !b.nom) return 0;
        return a.nom.localeCompare(b.nom);
      });
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
        this.selectedSlugs = []; // Réinitialise la sélection après chaque chargement
        this.modeSuppression = false; // Quitte le mode suppression après chaque chargement
      } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
      }
    },
    handleCompetenceAdded() {
      this.showForm = false;
      this.fetchCompetences();
    },
    // Annule le mode suppression et réinitialise la sélection
    cancelSuppression() {
      this.modeSuppression = false;
      this.selectedSlugs = [];
    },
    // Supprime toutes les compétences sélectionnées (requête DELETE pour chaque slug)
    async deleteSelected() {
      if (!confirm('Voulez-vous vraiment supprimer les compétences sélectionnées ?')) return;
      for (const slug of this.selectedSlugs) {
        await fetch(`http://localhost:3000/api/competences/${slug}`, { method: 'DELETE' });
      }
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
.competence-card-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
}
.select-checkbox {
  margin-right: 8px;
  margin-top: 8px;
  accent-color: #c65757;
  width: 18px;
  height: 18px;
}
.delete-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #23233a;
  color: #fff;
  border-radius: 6px;
  padding: 10px 18px;
  margin-bottom: 12px;
  border: 1px solid #c65757;
}
.btn-delete {
  background: #c65757;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-delete:hover {
  background: #8f4040;
}
.btn-cancel {
  background: #4a4a4a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  transition: background-color 0.3s;
}
.btn-cancel:hover {
  background-color: #333;
}
</style>