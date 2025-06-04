<template>
  <!-- Conteneur principal de la liste des classes -->
  <div>
    <!-- Titre de la page -->
    <h1>Liste des Classes</h1>
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

export default {
  name: "ClassList", // Nom du composant
  components: { ClasseCard }, // Déclare ClasseCard comme composant enfant
  data() {
    return {
      classes: [],      // Liste des classes récupérées depuis l'API
      voies: [],        // Liste des voies (non utilisée ici, mais chargée)
      competences: [],  // Liste des compétences (non utilisée ici, mais chargée)
      showModal: false, // (plus utilisé)
      selectedClasse: null, // (plus utilisé)
      selectedVoies: [],    // (plus utilisé)
      selectedCompetences: [] // (plus utilisé)
    };
  },
  created() {
    // Récupère toutes les classes depuis l'API
    fetch("http://localhost:3000/api/classes")
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la récupération des classes");
        return response.json();
      })
      .then((data) => { this.classes = data; })
      .catch((error) => { console.error("Erreur:", error); });
    // Récupère toutes les voies (pour d'autres usages éventuels)
    fetch("http://localhost:3000/api/voies")
      .then((r) => r.json())
      .then((data) => { this.voies = data; })
      .catch((e) => { console.error("Erreur voies:", e); });
    // Récupère toutes les compétences (pour d'autres usages éventuels)
    fetch("http://localhost:3000/api/competences")
      .then((r) => r.json())
      .then((data) => { this.competences = data; })
      .catch((e) => { console.error("Erreur competences:", e); });
  },
};
</script>

<style scoped>
.classe-cards-container {
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
  