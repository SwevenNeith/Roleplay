<template>
    <div>
      <!-- Titre de la voie -->
      <h1>{{ voie.nom }}</h1>
      <!-- Description principale de la voie -->
      <p><strong>Description :</strong> {{ voie.description }}</p>
  
      <!-- Bloc des compétences associées -->
      <div v-if="competences.length">
        <h2>Compétences associées</h2>
        <!-- Accordéon pour chaque compétence -->
        <div v-for="comp in competences" :key="comp.slug" class="competence-accordion">
          <!-- En-tête cliquable de la compétence -->
          <div class="competence-header" @click="toggleCompetence(comp.slug)">
            <h3>{{ comp.nom }}</h3>
            <span>{{ isCompetenceOpen(comp.slug) ? '▲' : '▼' }}</span>
          </div>
          <!-- Détails de la compétence, affichés si ouverte -->
          <transition name="fade">
            <div v-if="isCompetenceOpen(comp.slug)" class="competence-content">
              <p><strong>Description :</strong> {{ comp.description }}</p>
              <p v-if="comp.niveau"><strong>Niveau :</strong> {{ comp.niveau }}</p>
              <p v-if="comp.degats"><strong>Dégâts :</strong> {{ comp.degats }}</p>
              <p v-if="comp.allie"><strong>Effets sur les alliés :</strong> {{ comp.allie }}</p>
              <p v-if="comp.ennemi"><strong>Effets sur les ennemis :</strong> {{ comp.ennemi }}</p>
              <p v-if="comp.sauvegarde"><strong>Sauvegarde :</strong> {{ comp.sauvegarde }}</p>
              <p v-if="comp.portee"><strong>Portée :</strong> {{ comp.portee }}</p>
              <p v-if="comp.duree"><strong>Durée :</strong> {{ comp.duree }}</p>
            </div>
          </transition>
        </div>
      </div>
      <p v-else>Aucune compétence associée.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VoieTemplate', // Nom du composant
    props: {
      voie: { type: Object, required: true }, // Voie à afficher
      competences: { type: Array, required: true }, // Compétences associées
    },
    data() {
      return {
        competenceOpen: null // Slug de la compétence ouverte
      };
    },
    methods: {
      // Ouvre/ferme l'accordéon d'une compétence
      toggleCompetence(slug) {
        this.competenceOpen = this.competenceOpen === slug ? null : slug;
      },
      // Vérifie si la compétence est ouverte
      isCompetenceOpen(slug) {
        return this.competenceOpen === slug;
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #333;
  }
  
  .competence-accordion {
    margin-bottom: 12px; /* Espace entre les accordéons */
    border-radius: 6px;  /* Coins arrondis */
    border: 1px solid #2c6578; /* Bordure */
    background: #18182a; /* Fond */
  }
  .competence-header {
    display: flex; /* Titre + flèche sur la même ligne */
    justify-content: space-between;
    align-items: center;
    cursor: pointer; /* Main au survol */
    padding: 10px 16px;
    background: #23233a;
    border-radius: 6px;
  }
  .competence-content {
    padding: 10px 22px 10px 28px; /* Espacement interne */
    background: #22223a;
    border-radius: 0 0 6px 6px;
  }
  .fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
  .fade-enter, .fade-leave-to { opacity: 0; }
  </style>
  