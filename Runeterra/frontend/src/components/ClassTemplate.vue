<template>
  <div v-if="classe">
    <h1>{{ classe.nom }}</h1>
    <p>{{ classe.description }}</p>

    <div v-if="filteredVoies.length">
      <h2>Voies</h2>
      <div v-for="voie in filteredVoies" :key="voie.slug">
        <h3>{{ voie.nom }}</h3>
        <p>{{ voie.description }}</p>

        <div v-if="filteredCompetences(voie.slug).length">
          <h4>Compétences</h4>
          <ul>
            <li v-for="competence in filteredCompetences(voie.slug)" :key="competence.slug">
              <strong>{{ competence.nom }}</strong>: {{ competence.description }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassTemplate",
  props: {
    classe_slug: {
      type: String,
      required: true, // Prop obligatoire
    },
  },
  data() {
    return {
      classe: null, // Stockage de la classe
      voies: [], // Toutes les voies récupérées
      competences: [], // Toutes les compétences récupérées
    };
  },
  computed: {
    // Filtrer les voies en fonction du slug de la classe (utilise `classe_slug`)
    filteredVoies() {
      return this.voies.filter((voie) => voie.classe_slug === this.classe_slug);
    },
  },
  methods: {
    // Filtrer les compétences associées à une voie spécifique (utilise `voie_slug`)
    filteredCompetences(voieSlug) {
      return this.competences.filter((competence) => competence.voie_slug === voieSlug);
    },
    // Récupérer les données depuis l'API
    async fetchData() {
      try {
        // Récupère la classe via son slug
        const classeResponse = await fetch(`http://localhost:3000/api/classes/${this.classe_slug}`);
        if (!classeResponse.ok) {
          throw new Error("Erreur lors de la récupération de la classe");
        }
        const classeData = await classeResponse.json();
        this.classe = classeData.classe;

        // Récupère toutes les voies
        const voiesResponse = await fetch("http://localhost:3000/api/voies");
        if (!voiesResponse.ok) {
          throw new Error("Erreur lors de la récupération des voies");
        }
        const voiesData = await voiesResponse.json();
        this.voies = voiesData;

        // Récupère toutes les compétences
        const competencesResponse = await fetch("http://localhost:3000/api/competences");
        if (!competencesResponse.ok) {
          throw new Error("Erreur lors de la récupération des compétences");
        }
        const competencesData = await competencesResponse.json();
        this.competences = competencesData;
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    },
  },
  created() {
    // Charger les données au montage du composant
    this.fetchData();
  },
};
</script>

<style scoped>
/* Styles spécifiques à ClassTemplate */
</style>
