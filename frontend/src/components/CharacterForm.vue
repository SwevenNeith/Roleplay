<!-- Composant réutilisable pour la création/modification de personnages -->
<template>
  <div class="character-form">
    <div class="edit-form">
      <!-- Section d'en-tête avec les informations de base -->
      <div class="header-section">
        <!-- Nom du personnage -->
        <div class="form-group">
          <label>Nom du personnage :</label>
          <input v-model="formData.nom" type="text" required>
        </div>
        <!-- Informations complémentaires -->
        <div class="header-right">
          <div class="form-group">
            <label>Classe :</label>
            <select v-model="formData.classe" required>
              <option value="">Choisir une classe</option>
              <option 
                v-for="classe in classes" 
                :key="classe._id" 
                :value="classe.slug"
              >
                {{ classe.nom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Race :</label>
            <input v-model="formData.race" type="text" required>
          </div>
          <div class="form-group">
            <label>Joueur :</label>
            <input v-model="formData.joueur" type="text" required>
          </div>
          <div class="form-group">
            <label>Niveau :</label>
            <select v-model.number="formData.niveau" @change="updateMaxXP">
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Expérience :</label>
            <div class="xp-input-container">
              <input 
                v-model.number="formData.experience" 
                type="number" 
                min="0" 
                :max="maxXP"
                @input="handleXPChange"
              >
              <span class="xp-max">/ {{ maxXP }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section principale en 3 colonnes -->
      <div class="main-section">
        <!-- Colonne gauche : Caractéristiques -->
        <div class="left-column">
          <h4>Caractéristiques</h4>
          <div class="characteristics-list">
            <div v-for="(value, carac) in formData.caracs" :key="carac" class="characteristic-box">
              <label>{{ carac }}</label>
              <input v-model.number="formData.caracs[carac]" type="number" required>
            </div>
          </div>
        </div>

        <!-- Colonne centrale : Maîtrises -->
        <div class="middle-column">
          <h4>Maîtrises</h4>
          <div class="skills-list">
            <div v-for="(value, maitrise) in formData.maitrises" :key="maitrise" class="skill-item">
              <label>{{ maitrise }}</label>
              <input v-model.number="formData.maitrises[maitrise]" type="number" required>
            </div>
          </div>
        </div>

        <!-- Colonne droite : Statistiques de combat -->
        <div class="right-column">
          <div class="combat-stats">
            <!-- Inspiration -->
            <div class="stat-box">
              <label>Inspiration</label>
              <input v-model.number="formData.inspiration" type="number" min="0">
            </div>
            <!-- Classe d'armure -->
            <div class="stat-box">
              <label>Classe d'armure</label>
              <input v-model.number="formData.armure" type="number" min="0">
            </div>
            <!-- Initiative -->
            <div class="stat-box">
              <label>Initiative</label>
              <input v-model.number="formData.initiative" type="number">
            </div>
            <!-- Vitesse -->
            <div class="stat-box">
              <label>Vitesse</label>
              <input v-model.number="formData.vitesse" type="number" min="0">
            </div>
            <!-- Points de vie actuels/maximum -->
            <div class="hp-box">
              <label>Points de vie</label>
              <div class="hp-inputs">
                <input v-model.number="formData.pv[0]" type="number" min="0" placeholder="Actuels">
                <span>/</span>
                <input v-model.number="formData.pv[1]" type="number" min="0" placeholder="Maximum">
              </div>
            </div>
            <!-- Dé de récupération -->
            <div class="stat-box">
              <label>Dé de récupération</label>
              <input v-model="formData.deRecup" type="text">
            </div>
          </div>
        </div>
      </div>

      <!-- Section background -->
      <div class="background-section">
        <h4>Background</h4>
        <textarea v-model="formData.background" rows="3"></textarea>
      </div>

      <!-- Section des compétences -->
      <div class="competences-section">
        <h3>Compétences</h3>
        <div class="competences-list">
          <div 
            v-for="(competence, index) in formData.competences" 
            :key="index"
            class="competence-item"
          >
            <strong>{{ competence.nom }}</strong>
            <span class="competence-type">{{ competence.type }}</span>
            <div class="competence-voie">Voie : {{ competence.voie || competence.voie_nom || competence.voie_slug }}</div>
            <button 
              @click.prevent="removeCompetence(index)" 
              class="remove-competence-btn"
            >
              ×
            </button>
          </div>
        </div>
        <CompetenceSelector
          v-if="formData.classe"
          :classe="formData.classe"
          :existing-competences="formData.competences"
          @select="addCompetence"
        />
      </div>

      <!-- Boutons d'action -->
      <div class="button-group">
        <button class="btn-save" @click="saveCharacter">{{ submitButtonText }}</button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CompetenceSelector from './CompetenceSelector.vue';

export default {
  name: 'CharacterForm',
  components: {
    CompetenceSelector
  },
  // Props reçues du composant parent
  props: {
    // Données initiales pour le formulaire
    initialData: {
      type: Object,
      default: () => ({
        nom: '',
        race: '',
        classe: '',
        joueur: '',
        experience: 0,
        caracs: {
          Force: 0,
          Dextérité: 0,
          Constitution: 0,
          Intelligence: 0,
          Sagesse: 0,
          Charisme: 0,
        },
        inspiration: 0,
        maitrises: {},
        armure: 0,
        pv: [0, 0], // [PV actuels, PV maximum]
        vitesse: 0,
        deRecup: '',
        background: '',
        competences: []
      })
    },
    // Texte du bouton de soumission
    submitButtonText: {
      type: String,
      default: 'Sauvegarder'
    }
  },
  // État local du composant
  data() {
    return {
      // Clone profond des données initiales pour éviter la mutation directe
      formData: JSON.parse(JSON.stringify(this.initialData)),
      // Liste des maîtrises disponibles
      maitrisesList: [
        'Acrobaties', 'Arcanes', 'Athlétisme', 'Discrétion', 'Dressage',
        'Escamotage', 'Histoire', 'Intimidation', 'Investigation', 'Médecine',
        'Nature', 'Perception', 'Persuasion', 'Religion', 'Représentation',
        'Survie', 'Tromperie', 'Perception passive', 'Performance', 'Survie urbaine'
      ],
      maxXP: 100, // Valeur par défaut pour le niveau 1
      classes: []
    }
  },
  // Hook de cycle de vie
  created() {
    // Initialise les maîtrises si non définies
    if (!this.formData.maitrises || Object.keys(this.formData.maitrises).length === 0) {
      this.formData.maitrises = {};
      this.maitrisesList.forEach(m => {
        this.formData.maitrises[m] = 0;
      });
    }
    this.updateMaxXP(); // Initialise le maximum d'XP

    // Charge la liste des classes
    this.fetchClasses();
  },
  // Méthodes du composant
  methods: {
    async fetchClasses() {
      try {
        const response = await axios.get('http://localhost:3000/api/classes');
        this.classes = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des classes:", error);
      }
    },
    // Ajoute une nouvelle compétence
    addCompetence(competence) {
      this.formData.competences.push(competence);
    },
    // Supprime une compétence
    removeCompetence(index) {
      this.formData.competences.splice(index, 1);
    },
    // Sauvegarde le personnage
    saveCharacter() {
      this.$emit('submit', this.formData);
    },
    // Met à jour le maximum d'XP en fonction du niveau
    updateMaxXP() {
      this.maxXP = this.formData.niveau * 100;
      // Ajuste l'XP si elle dépasse le nouveau maximum
      if (this.formData.experience > this.maxXP) {
        this.formData.experience = this.maxXP;
      }
    },
    // Gère les changements d'XP et la progression de niveau
    handleXPChange() {
      if (this.formData.experience >= this.maxXP && this.formData.niveau < 5) {
        const excessXP = this.formData.experience - this.maxXP;
        this.formData.niveau++;
        this.updateMaxXP();
        this.formData.experience = excessXP;
      }
    }
  },
  watch: {
    'formData.classe'(newClasse, oldClasse) {
      if (newClasse !== oldClasse) {
        this.formData.competences = [];
      }
    },
  },
}
</script>

<style scoped>
/* Style du formulaire principal */
.character-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  margin: 0 auto;
}

/* Style du conteneur du formulaire */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Style de l'en-tête */
.header-section {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #c8aa6e;
  padding-bottom: 15px;
}

/* Grille pour les informations de droite */
.header-right {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 1;
}

/* Layout principal en 3 colonnes */
.main-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
  width: 100%;
}

/* Style de la colonne gauche */
.left-column {
  border-right: 1px solid #ddd;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Liste des caractéristiques */
.characteristics-list {
  display: flex;
  flex-direction: column;
  gap: 150px;
  width: 100%;
}

/* Style des boîtes de caractéristiques */
.characteristic-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
}

.characteristic-box label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.characteristic-box input {
  width: 75%;
  text-align: center;
}

/* Style de la colonne centrale */
.middle-column {
  padding: 0 20px;
  border-right: 1px solid #ddd;
}

/* Liste des maîtrises */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto;
}

/* Style des éléments de maîtrise */
.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.skill-item input {
  width: 80px;
  text-align: center;
}

/* Style de la colonne droite */
.right-column {
  padding-left: 10px;
  padding-right: 20px;
  padding-top: 100px;
}

/* Stats de combat */
.combat-stats {
  display: flex;
  flex-direction: column;
  gap: 150px;
}

/* Style des boîtes de stats */
.stat-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.stat-box input {
  width: 75%;
  text-align: center;
  margin: 0 auto;
}

/* Style de la boîte de points de vie */
.hp-box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* Style des inputs de points de vie */
.hp-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.hp-inputs input {
  width: 80px;
  text-align: center;
}

/* Style de la section background */
.background-section {
  margin-top: 20px;
}

.background-section textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Styles communs */
h4 {
  color: #2c6578;
  margin-bottom: 15px;
  border-bottom: 1px solid #c8aa6e;
  padding-bottom: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Style des groupes de formulaire */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

/* Style des boutons */
.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #9e9e9e;
  color: white;
}

/* Effets de survol des boutons */
.btn-save:hover { background-color: #388E3C; }
.btn-cancel:hover { background-color: #757575; }

/* Adaptations responsives */
@media (max-width: 1400px) {
  .main-section {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .left-column,
  .middle-column,
  .right-column {
    border: none;
    padding: 0;
  }

  .characteristics-list,
  .skills-list,
  .stat-box,
  .hp-box {
    max-width: 400px;
    margin: 0 auto;
  }
}

.xp-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.xp-max {
  color: #666;
  font-size: 0.9em;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

/* Nouveaux styles pour la section des compétences */
.competences-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.competences-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin: 15px 0;
}

.competence-item {
  position: relative;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.remove-competence-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #c65757;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.remove-competence-btn:hover {
  color: #8f4040;
}

.competence-type {
  display: block;
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}

.competence-voie {
  font-size: 0.85em;
  color: #888;
  margin-top: 2px;
}
</style> 