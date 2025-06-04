<template>
  <div v-if="classe">
    <h1>{{ classe.nom }}</h1>
    <p>{{ classe.description }}</p>

    <div v-if="voies.length">
      <h2>Voies</h2>
      <div v-for="voie in voies" :key="voie.slug" class="voie-accordion">
        <div class="voie-header" @click="toggleVoie(voie.slug)">
          <h3>{{ voie.nom }}</h3>
          <span>{{ isVoieOpen(voie.slug) ? '▲' : '▼' }}</span>
        </div>
        <transition name="fade">
          <div v-if="isVoieOpen(voie.slug)" class="voie-content">
            <p>{{ voie.description }}</p>
            <div v-if="competencesByVoie(voie.slug).length">
              <ul>
                <li v-for="comp in competencesByVoie(voie.slug)" :key="comp.slug" class="competence-accordion">
                  <div class="competence-header" @click="toggleCompetence(comp.slug)">
                    <strong>{{ comp.nom }}</strong>
                    <span>{{ isCompetenceOpen(comp.slug) ? '▲' : '▼' }}</span>
                  </div>
                  <transition name="fade">
                    <div v-if="isCompetenceOpen(comp.slug)" class="competence-content">
                      <p>{{ comp.description }}</p>
                    </div>
                  </transition>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClasseDetails",
  data() {
    return {
      classe: null,
      voies: [],
      competences: [],
      voieOpen: null, // slug de la voie ouverte
      competenceOpen: null, // slug de la compétence ouverte
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const slug = this.$route.params.slug;
      // Récupère la classe
      const classeRes = await fetch(`http://localhost:3000/api/classes/${slug}`);
      const classeData = await classeRes.json();
      this.classe = classeData.classe;
      // Récupère toutes les voies
      const voiesRes = await fetch("http://localhost:3000/api/voies");
      this.voies = (await voiesRes.json()).filter(v => v.classe_slug === slug);
      // Récupère toutes les compétences
      const compRes = await fetch("http://localhost:3000/api/competences");
      this.competences = await compRes.json();
    },
    competencesByVoie(voieSlug) {
      return this.competences.filter(c => c.voie_slug === voieSlug);
    },
    toggleVoie(slug) {
      this.voieOpen = this.voieOpen === slug ? null : slug;
      this.competenceOpen = null; // Ferme toute compétence quand on change de voie
    },
    isVoieOpen(slug) {
      return this.voieOpen === slug;
    },
    toggleCompetence(slug) {
      this.competenceOpen = this.competenceOpen === slug ? null : slug;
    },
    isCompetenceOpen(slug) {
      return this.competenceOpen === slug;
    }
  }
};
</script>

<style scoped>
.voie-accordion {
  border: 1px solid #2c6578;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #18182a;
}
.voie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 18px;
  background: #23233a;
  border-radius: 8px 8px 0 0;
}
.voie-content {
  padding: 12px 18px 8px 18px;
}
ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.competence-accordion {
  margin-bottom: 8px;
  border-radius: 6px;
}
.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  background: #23233a;
  border-radius: 6px;
}
.competence-content {
  padding: 8px 16px 8px 24px;
  background: #22223a;
  border-radius: 0 0 6px 6px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>
