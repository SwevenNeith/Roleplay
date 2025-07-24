<template>
  <div>
    <!-- En-tête avec titre et bouton d'ajout/suppression -->
    <div class="header-section">
      <h1>Liste des objets</h1>
      <div>
        <button class="btn-add" @click="showForm = !showForm">
          {{ showForm ? 'Annuler' : 'Ajouter un objet' }}
        </button>
        <!-- Bouton pour activer le mode suppression (affiche les cases à cocher) -->
        <button class="btn-delete" v-if="!modeSuppression" @click="modeSuppression = true">Supprimer</button>
        <!-- Bouton pour quitter le mode suppression -->
        <button class="btn-cancel" v-if="modeSuppression" @click="cancelSuppression">Annuler</button>
      </div>
    </div>

    <!-- Barre de suppression groupée (visible seulement en mode suppression et si au moins un objet est sélectionné) -->
    <div v-if="modeSuppression && selectedSlugs.length" class="delete-bar">
      <span>{{ selectedSlugs.length }} sélectionné(s)</span>
      <!-- Bouton pour supprimer tous les objets sélectionnés -->
      <button class="btn-delete" @click="deleteSelected">Supprimer</button>
    </div>

    <!-- Formulaire d'ajout d'objet -->
    <ObjetForm
      v-if="showForm"
      @objet-added="handleObjetAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque objet -->
    <div class="objet-cards-container">
      <div v-for="objet in objets" :key="objet.slug" class="objet-card-wrapper">
        <!-- Case à cocher pour la sélection (visible uniquement en mode suppression) -->
        <input v-if="modeSuppression" type="checkbox" class="select-checkbox" :value="objet.slug" v-model="selectedSlugs">
        <ObjetCard :objet="objet" />
      </div>
    </div>
  </div>
</template>

<script>
import ObjetCard from '../components/ObjetCard.vue';
import ObjetForm from '../components/ObjetForm.vue';

export default {
  name: 'ObjetList',
  components: {
    ObjetCard,
    ObjetForm
  },
  data() {
    return {
      objets: [], // Liste des objets récupérés depuis l'API
      showForm: false, // Contrôle l'affichage du formulaire
      selectedSlugs: [], // Liste des slugs sélectionnés pour suppression
      modeSuppression: false // Contrôle l'affichage du mode suppression
    }
  },
  created() {
    this.fetchObjets();
  },
  methods: {
    // Récupère la liste des objets depuis l'API
    async fetchObjets() {
      try {
        const response = await fetch('http://localhost:3000/api/objets');
        const data = await response.json();
        this.objets = Array.isArray(data) ? data.filter(o => o) : [];
        this.selectedSlugs = []; // Réinitialise la sélection après chaque chargement
        this.modeSuppression = false; // Quitte le mode suppression après chaque chargement
      } catch (error) {
        console.error('Erreur lors de la récupération des objets:', error);
      }
    },
    // Gère l'ajout d'un objet (ferme le formulaire et recharge la liste)
    handleObjetAdded() {
      this.showForm = false;
      this.fetchObjets();
    },
    // Annule le mode suppression et réinitialise la sélection
    cancelSuppression() {
      this.modeSuppression = false;
      this.selectedSlugs = [];
    },
    // Supprime tous les objets sélectionnés (requête DELETE pour chaque slug)
    async deleteSelected() {
      if (!confirm('Voulez-vous vraiment supprimer les objets sélectionnés ?')) return;
      for (const slug of this.selectedSlugs) {
        await fetch(`http://localhost:3000/api/objets/${slug}`, { method: 'DELETE' });
      }
      this.fetchObjets();
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

.objet-cards-container {
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
.objet-card-wrapper {
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
