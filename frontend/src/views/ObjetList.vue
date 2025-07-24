<template>
  <div>
    <!-- En-tête avec titre et bouton d'ajout -->
    <div class="header-section">
      <h1>Liste des objets</h1>
      <button class="btn-add" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : 'Ajouter un objet' }}
      </button>
    </div>

    <!-- Formulaire d'ajout d'objet -->
    <ObjetForm
      v-if="showForm"
      @objet-added="handleObjetAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque objet -->
    <div class="objet-cards-container">
      <ObjetCard
        v-for="objet in objets"
        :key="objet.slug"
        :objet="objet"
      />
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
      showForm: false // Contrôle l'affichage du formulaire
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
      } catch (error) {
        console.error('Erreur lors de la récupération des objets:', error);
      }
    },
    // Gère l'ajout d'un objet (ferme le formulaire et recharge la liste)
    handleObjetAdded() {
      this.showForm = false;
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
</style>
