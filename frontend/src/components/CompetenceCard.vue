<template>
  <!-- Carte cliquable représentant une compétence -->
  <div class="competence-card" v-if="competence" @click="goToCompetence">
    <h2>{{ competence.nom }}</h2>
    <p v-if="competence.description">
      {{ competence.description.substring(0, 80) }}
      <span v-if="competence.description.length > 80">...</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'CompetenceCard',
  props: {
    competence: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToCompetence() {
      this.$router.push(`/runeterra-competences/${this.competence.slug}`);
    }
  }
}
</script>

<style scoped>
.competence-card {
  background: #18182a;
  color: #c8aa6e;
  border: 1px solid #2c6578;
  border-radius: 10px;
  padding: 18px 22px;
  margin: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(44,101,120,0.08);
}
.competence-card:hover {
  box-shadow: 0 4px 16px #2c6578;
  background: #23233a;
}
h2 {
  margin: 0 0 8px 0;
  font-size: 1.3em;
}
p {
  margin: 0;
  color: #aaa;
  font-size: 1em;
}
</style>