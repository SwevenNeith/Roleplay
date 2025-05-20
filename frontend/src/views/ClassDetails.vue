<template>
  <div>
    <!-- Affichage de ClassTemplate avec les données récupérées -->
    <ClassTemplate :classe_slug="classe_slug" v-if="classe_slug" />
  </div>
</template>

<script>
import ClassTemplate from "../components/ClassTemplate.vue"; // Import du composant ClassTemplate

export default {
  name: "ClassDetails",
  components: {
    ClassTemplate, // Déclaration du composant enfant
  },
  data() {
    return {
      classe_slug: null, // Le slug de la classe récupéré dynamiquement
    };
  },
  created() {
    // Récupère le slug de la classe depuis l'URL
    this.classe_slug = this.$route.params.slug;

    // Vérifie si le slug est valide
    if (!this.classe_slug) {
      console.error("Le slug de la classe est manquant.");
    }
  },
};
</script>

<style scoped>
/* Styles spécifiques à ClassDetails */
</style>
