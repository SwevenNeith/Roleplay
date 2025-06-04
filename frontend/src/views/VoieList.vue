<template>
  <!-- Conteneur principal de la liste des voies -->
  <div>
    <!-- Titre de la page -->
    <h1>Liste des Voies</h1>
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
import VoieCard from '../components/VoieCard.vue'; // Importe le composant VoieCard

export default {
  name: "VoieList", // Nom du composant
  components: { VoieCard }, // Déclare VoieCard comme composant enfant
  data() {
    return {
      voies: [],   // Liste des voies récupérées depuis l'API
      classes: []  // Liste des classes pour faire la correspondance slug → nom
    };
  },
  created() {
    // Récupère toutes les voies depuis l'API
    fetch("http://localhost:3000/api/voies")
      .then((r) => r.json())
      .then((data) => { this.voies = data; });
    // Récupère toutes les classes depuis l'API
    fetch("http://localhost:3000/api/classes")
      .then((r) => r.json())
      .then((data) => { this.classes = data; });
  },
  methods: {
    // Retourne le nom de la classe à partir de son slug
    classeNom(slug) {
      const c = this.classes.find(cl => cl.slug === slug); // Cherche la classe correspondante
      return c ? c.nom : slug; // Retourne le nom ou le slug si non trouvé
    }
  }
};
</script>

<style scoped>
.voie-cards-container {
  display: flex;         /* Affiche les cards en ligne */
  flex-wrap: wrap;       /* Retour à la ligne automatique */
  gap: 18px;             /* Espace entre les cards */
  margin-top: 24px;      /* Marge au-dessus de la grille */
}
h1 {
  color: #c8aa6e;        /* Couleur du titre */
  margin-bottom: 10px;   /* Marge sous le titre */
}
</style>
  