<!--
  Ce composant affiche les détails d'une origine spécifique.
  Il affiche le nom, la description, les traits et les régions associées à l'origine.
-->

<template>
    <div>
      <!-- Affichage des détails de l'origine via le composant OrigineTemplate -->
      <OrigineTemplate :origin="origin" v-if="origin" />
    </div>
  </template>
  
  <script>
  import OrigineTemplate from "../components/OrigineTemplate.vue";
  
  export default {
    name: "OrigineDetails", // Nom du composant
    components: {
      OrigineTemplate, // Importation du composant OrigineTemplate
    },
    data() {
      return {
        origin: null, // L'origine sélectionnée
      };
    },
    created() {
      // Récupère le slug de l'origine depuis l'URL
      const slug = this.$route.params.slug;
  
      // Appel à l'API pour récupérer les données de l'origine en fonction du slug
      fetch(`http://localhost:3000/api/origins/${slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des détails de l'origine");
          }
          return response.json();
        })
        .then((data) => {
          this.origin = data; // Stocke les données de l'origine récupérées
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    },
  };
  </script>
  