<template>
  <div v-if="competence">
    <h1>{{ competence.nom }}</h1>
    <button class="btn-edit" @click="showEdit = !showEdit">
      {{ showEdit ? 'Annuler' : 'Modifier' }}
    </button>
    <CompetenceForm
      v-if="showEdit"
      :initialData="competence"
      @competence-updated="handleCompetenceUpdated"
      @cancel="showEdit = false"
    />
    <div v-if="!showEdit">
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
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
import CompetenceForm from '../components/CompetenceForm.vue';
export default {
  name: 'CompetenceDetails',
  components: { CompetenceForm },
  data() {
    return {
      competence: null,
      showEdit: false
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
    },
    async handleCompetenceUpdated() {
      await this.fetchCompetence();
      this.showEdit = false;
    }
  }
}
</script>

<style scoped>
h1 {
  color: #c8aa6e;
  margin-bottom: 18px;
}
.btn-edit {
  background: #2c6578;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 1em;
  margin-bottom: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-edit:hover {
  background: #1e4a5a;
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