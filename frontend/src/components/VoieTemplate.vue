<template>
    <div>
      <!-- Titre de la voie -->
      <h1>{{ voie.nom }}</h1>
      <!-- Description principale de la voie -->
      <p><strong>Description :</strong> {{ voie.description }}</p>
  
      <!-- Bloc des compétences associées -->
      <div>
        <!-- En-tête avec titre et bouton d'ajout -->
        <div class="competences-header">
          <h2>Compétences associées</h2>
          <!-- Bouton pour afficher le formulaire d'ajout -->
          <button v-if="!showForm" class="btn-add" @click="showForm = true">
            Ajouter une compétence
          </button>
        </div>

        <!-- Formulaire d'ajout de compétence (affiché uniquement si showForm est true) -->
        <CompetenceForm
          v-if="showForm"
          :voieSlug="voie.slug"
          @competence-added="handleCompetenceAdded"
          @cancel="showForm = false"
        />

        <!-- Liste des compétences existantes -->
        <div v-if="competences.length" class="competences-list">
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
                <p v-if="comp.type"><strong>Type :</strong> {{ comp.type }}</p>
                <p v-if="comp.description"><strong>Description :</strong> {{ comp.description }}</p>
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
    </div>
  </template>
  
  <script>
  import CompetenceForm from './CompetenceForm.vue';

  export default {
    name: 'VoieTemplate',
    // Déclaration des composants utilisés
    components: {
      CompetenceForm // Composant pour ajouter une compétence
    },
    // Props reçues du composant parent
    props: {
      voie: { type: Object, required: true },      // Données de la voie
      competences: { type: Array, required: true } // Liste des compétences
    },
    // Données locales du composant
    data() {
      return {
        competenceOpen: null, // Slug de la compétence ouverte dans l'accordéon
        showForm: false      // État d'affichage du formulaire
      };
    },
    methods: {
      // Ouvre/ferme l'accordéon d'une compétence
      toggleCompetence(slug) {
        this.competenceOpen = this.competenceOpen === slug ? null : slug;
      },
      // Vérifie si une compétence est ouverte dans l'accordéon
      isCompetenceOpen(slug) {
        return this.competenceOpen === slug;
      },
      // Gère l'ajout d'une nouvelle compétence
      handleCompetenceAdded() {
        this.showForm = false; // Cache le formulaire
        this.$emit('competence-added'); // Informe le parent pour rafraîchir les données
      }
    }
  };
  </script>
  
  <style scoped>
  /* Style du titre principal */
  h1 {
    color: #c8aa6e;
    margin-bottom: 20px;
  }

  /* Mise en page de l'en-tête des compétences */
  .competences-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  /* Style du bouton d'ajout */
  .btn-add {
    background-color: #2c6578;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  /* Effet de survol du bouton d'ajout */
  .btn-add:hover {
    background-color: #1e4a5a;
  }
  
  /* Style de l'accordéon de compétence */
  .competence-accordion {
    margin-bottom: 12px;
    border-radius: 6px;
    border: 1px solid #2c6578;
    background: #18182a;
  }

  /* Style de l'en-tête de l'accordéon */
  .competence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px 16px;
    background: #23233a;
    border-radius: 6px;
  }

  /* Style du contenu de l'accordéon */
  .competence-content {
    padding: 10px 22px 10px 28px;
    background: #22223a;
    border-radius: 0 0 6px 6px;
  }

  /* Animation de transition pour l'accordéon */
  .fade-enter-active, .fade-leave-active { 
    transition: opacity 0.3s; 
  }
  
  .fade-enter, .fade-leave-to { 
    opacity: 0; 
  }
  </style>
  