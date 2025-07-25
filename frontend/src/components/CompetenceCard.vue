<!-- 
  Ce composant est utilisé pour afficher une compétence dans la liste des compétences
  Popover permettant d'afficher les détails de la compétence lorsque l'utilisateur survole la carte 
-->

<template>
  <!-- Carte cliquable représentant une compétence -->
  <div class="competence-card" @click="goToCompetence" @mouseenter="showDetails = true" @mouseleave="showDetails = false">
    <h2>{{ competence.nom }}</h2>
    <p v-if="competence.description">
      {{ competence.description.substring(0, 80) }}
      <span v-if="competence.description.length > 80">...</span>
    </p>
    <!-- Popover d'aperçu détaillé -->
    <div v-if="showDetails" class="competence-popover" @mouseenter="showDetails = true" @mouseleave="showDetails = false">
      <!-- <p v-if="competence.type"><strong>Type :</strong> {{ competence.type }}</p> -->
      <p v-if="competence.systeme"><strong>Système :</strong> {{ competence.systeme }}</p>
      <p v-if="competence.systeme_value"><strong>Valeur du système :</strong> {{ competence.systeme_value }}</p>
      <p v-if="competence.voie_slug"><strong>Voie associée :</strong> {{ competence.voie_slug }}</p>
      <p v-if="competence.niveau"><strong>Niveau :</strong> {{ competence.niveau }}</p>
      <p v-if="competence.composant && competence.composant.length"><strong>Composant :</strong> {{ competence.composant.join(', ') }}</p>
      <p v-if="competence.portee"><strong>Portée :</strong> {{ competence.portee }}</p>
      <p v-if="competence.zone"><strong>Zone d'effet :</strong> {{ competence.zone }}</p>
      <p v-if="competence.temps_incantation"><strong>Temps d'incantation :</strong> {{ competence.temps_incantation }}</p>
      <p v-if="competence.duree"><strong>Durée :</strong> {{ competence.duree }}</p>
      <p v-if="competence.degats"><strong>Dégâts :</strong> {{ competence.degats }}</p>
      <p v-if="competence.allie"><strong>Effets sur les alliés :</strong> {{ competence.allie }}</p>
      <p v-if="competence.ennemi"><strong>Effets sur les ennemis :</strong> {{ competence.ennemi }}</p>
      <p v-if="competence.sauvegarde"><strong>Sauvegarde :</strong> {{ competence.sauvegarde }}</p>
    </div>
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
  data() {
    return {
      showDetails: false
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
  position: relative;
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
.competence-popover {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 320px;
  max-width: 400px;
  background: #23233a;
  color: #eee;
  border: 1px solid #2c6578;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(44,101,120,0.18);
  padding: 18px 22px;
  z-index: 100;
  margin-top: 8px;
  font-size: 1em;
  pointer-events: auto;
}
.competence-popover h3 {
  color: #c8aa6e;
  margin-top: 0;
  margin-bottom: 10px;
}
.competence-popover p {
  margin: 6px 0;
  color: #eee;
  font-size: 1em;
}
.competence-popover strong {
  color: #c8aa6e;
}
</style>