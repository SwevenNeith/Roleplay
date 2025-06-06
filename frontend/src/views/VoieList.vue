<template>
  <!-- Conteneur principal de la liste des voies -->
  <div>
    <!-- Titre de la page -->
    <h1>Liste des Voies</h1>

    <!-- Bouton pour afficher le formulaire d'ajout -->
    <button v-if="!showForm" class="btn-add" @click="showForm = true">
      Ajouter une voie
    </button>

    <!-- Formulaire d'ajout de voie (affiché uniquement si showForm est true) -->
    <VoieForm
      v-if="showForm"
      :classes="classes"
      @voie-added="handleVoieAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque voie -->
    <div class="voie-cards-container">
      <!-- Boucle sur chaque voie pour afficher une VoieCard -->
      <VoieCard
        v-for="voie in voies"
        :key="voie.slug"
        :voie="voie"
        :classeNom="classeNom(voie.classe_slug)"
      />
    </div>
  </div>
</template>

<script>
import VoieCard from '../components/VoieCard.vue';
import VoieForm from '../components/VoieForm.vue';

export default {
  name: "VoieList",
  // Déclaration des composants utilisés
  components: { 
    VoieCard,  // Composant pour afficher une voie
    VoieForm   // Composant pour ajouter une voie
  },
  // Données locales du composant
  data() {
    return {
      voies: [],      // Liste des voies récupérées depuis l'API
      classes: [],    // Liste des classes pour faire la correspondance slug → nom
      showForm: false // État d'affichage du formulaire
    };
  },
  // Hook appelé à la création du composant
  created() {
    this.fetchData(); // Charge les données initiales
  },
  methods: {
    // Récupère les données depuis l'API
    fetchData() {
      // Récupère toutes les voies
      fetch("http://localhost:3000/api/voies")
        .then((r) => r.json())
        .then((data) => { this.voies = data; });
      // Récupère toutes les classes
      fetch("http://localhost:3000/api/classes")
        .then((r) => r.json())
        .then((data) => { this.classes = data; });
    },
    // Retourne le nom de la classe à partir de son slug
    classeNom(slug) {
      const c = this.classes.find(cl => cl.slug === slug);
      return c ? c.nom : slug; // Retourne le nom si trouvé, sinon le slug
    },
    // Gère l'ajout d'une nouvelle voie
    handleVoieAdded() {
      this.showForm = false;    // Cache le formulaire
      this.fetchData();         // Rafraîchit la liste des voies
    }
  }
};
</script>

<style scoped>
/* Style de la grille de cards */
.voie-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
}

/* Style du titre principal */
h1 {
  color: #c8aa6e;
  margin-bottom: 10px;
}

/* Style du bouton d'ajout */
.btn-add {
  background-color: #2c6578;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

/* Effet de survol du bouton d'ajout */
.btn-add:hover {
  background-color: #1e4a5a;
}
</style>
  