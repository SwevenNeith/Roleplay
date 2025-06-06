<template>
  <!-- Conteneur principal de la liste des classes -->
  <div>
    <div class="header-section">
      <h1>Liste des Classes</h1>
      <button class="btn-add" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : 'Ajouter une classe' }}
      </button>
    </div>

    <ClasseForm 
      v-if="showForm"
      @classe-added="handleClasseAdded"
      @cancel="showForm = false"
    />

    <!-- Grille de cards pour chaque classe -->
    <div class="classe-cards-container">
      <!-- Boucle sur chaque classe pour afficher une ClasseCard -->
      <ClasseCard
        v-for="classe in classes"
        :key="classe.slug"
        :classe="classe"
      />
    </div>
  </div>
</template>

<script>
import ClasseCard from '../components/ClasseCard.vue'; // Importe le composant ClasseCard
import ClasseForm from '../components/ClasseForm.vue';

export default {
  name: "ClassList", // Nom du composant
  components: { 
    ClasseCard,
    ClasseForm
  },
  data() {
    return {
      classes: [],      // Liste des classes récupérées depuis l'API
      voies: [],        // Liste des voies (non utilisée ici, mais chargée)
      competences: [],  // Liste des compétences (non utilisée ici, mais chargée)
      showForm: false,   // (plus utilisé)
      selectedClasse: null, // (plus utilisé)
      selectedVoies: [],    // (plus utilisé)
      selectedCompetences: [] // (plus utilisé)
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [classesRes, voiesRes, competencesRes] = await Promise.all([
          fetch("http://localhost:3000/api/classes"),
          fetch("http://localhost:3000/api/voies"),
          fetch("http://localhost:3000/api/competences")
        ]);

        if (!classesRes.ok) throw new Error("Erreur lors de la récupération des classes");
        if (!voiesRes.ok) throw new Error("Erreur lors de la récupération des voies");
        if (!competencesRes.ok) throw new Error("Erreur lors de la récupération des compétences");

        this.classes = await classesRes.json();
        this.voies = await voiesRes.json();
        this.competences = await competencesRes.json();
      } catch (error) {
        console.error("Erreur:", error);
      }
    },
    handleClasseAdded() {
      this.showForm = false;
      this.fetchData();
    }
  },
};
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.classe-cards-container {
  display: flex;         /* Affiche les cards en ligne */
  flex-wrap: wrap;       /* Retour à la ligne automatique */
  gap: 18px;             /* Espace entre les cards */
  margin-top: 24px;      /* Marge au-dessus de la grille */
}
h1 {
  color: #c8aa6e;        /* Couleur du titre */
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
  