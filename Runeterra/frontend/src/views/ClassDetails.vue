<template>
    <div>
      <!-- Affiche les détails d'une classe via le composant ClassTemplate -->
      <ClassTemplate :classe="classe" :voies="voies" v-if="classe" />
    </div>
  </template>
  
  <script>
  import ClassTemplate from "../components/ClassTemplate.vue"; // Import du composant ClassTemplate
  
  export default {
    name: "ClassDetails", // Nom du composant
    components: {
      ClassTemplate, // Déclare le composant ClassTemplate
    },
    data() {
      return {
        classe: null, // Données de la classe
        voies: [], // Liste des voies associées
      };
    },
    created() {
      // Récupère le slug depuis l'URL
      const slug = this.$route.params.slug;
      // Appelle le backend pour récupérer les détails de la classe
      fetch(`http://localhost:3000/api/classes/${slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des détails de la classe");
          }
          return response.json();
        })
        .then((data) => {
          this.classe = data.classe; // Stocke les données de la classe
          this.voies = data.voies; // Stocke les voies associées
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    },
  };
  </script>
  
  <style scoped>
  /* Styles spécifiques pour ClassDetails */
  </style>
  