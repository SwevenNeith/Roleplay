<template>
    <div>
      <!-- Vérifie que la voie est chargée -->
      <VoieTemplate :voie="voie" :competences="competences" v-if="voie" />
      <p v-else>Chargement des données...</p>
    </div>
  </template>
  
  <script>
  import VoieTemplate from "../components/VoieTemplate.vue";
  
  export default {
    name: "VoieDetails", // Nom de la vue
    components: {
      VoieTemplate, // Déclare le composant
    },
    data() {
      return {
        voie: null, // Données de la voie
        competences: [], // Liste des compétences associées
      };
    },
    created() {
      this.fetchVoieData(); // Charge les données à la création
    },
    methods: {
      fetchVoieData() {
        const slug = this.$route.params.slug; // Récupère le slug depuis l'URL
        fetch(`http://localhost:3000/api/voies/${slug}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la récupération des détails de la voie");
            }
            return response.json();
          })
          .then((data) => {
            // Stocke les données reçues
            this.voie = data.voie;
            this.competences = data.competences;
          })
          .catch((error) => {
            console.error("Erreur:", error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles spécifiques pour VoieDetails */
  </style>
  