<template>
  <div v-if="competence">
    <h1>{{ competence.nom }}</h1>
    <p v-if="competence.type"><strong>Type :</strong> {{ competence.type }}</p>
    <p v-if="competence.description"><strong>Description :</strong> {{ competence.description }}</p>
    <p v-if="competence.niveau"><strong>Niveau :</strong> {{ competence.niveau }}</p>
    <p v-if="competence.degats"><strong>Dégâts :</strong> {{ competence.degats }}</p>
    <p v-if="competence.allie"><strong>Effets sur les alliés :</strong> {{ competence.allie }}</p>
    <p v-if="competence.ennemi"><strong>Effets sur les ennemis :</strong> {{ competence.ennemi }}</p>
    <p v-if="competence.sauvegarde"><strong>Sauvegarde :</strong> {{ competence.sauvegarde }}</p>
    <p v-if="competence.portee"><strong>Portée :</strong> {{ competence.portee }}</p>
    <p v-if="competence.duree"><strong>Durée :</strong> {{ competence.duree }}</p>
    <p v-if="competence.voie_slug"><strong>Voie associée :</strong> {{ competence.voie_slug }}</p>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
export default {
  name: 'CompetenceDetails',
  data() {
    return {
      competence: null
    };
  },
  created() {
    this.fetchCompetence();
  },
  methods: {
    async fetchCompetence() {
      const slug = this.$route.params.slug;
      const res = await fetch(`http://localhost:3000/api/competences`);
      const competences = await res.json();
      this.competence = competences.find(c => c.slug === slug);
    }
  }
}
</script>

<style scoped>
h1 {
  color: #c8aa6e;
  margin-bottom: 18px;
}
p {
  margin: 8px 0;
  color: #eee;
  font-size: 1.08em;
}
strong {
  color: #c8aa6e;
}
</style>