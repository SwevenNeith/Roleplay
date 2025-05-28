<!-- Composant qui gère la sélection des compétences pendant le combat -->
<template>
  <div class="competence-selector">
    <h3>Compétences disponibles</h3>

    <!-- Liste des compétences -->
    <div class="competences-list">
      <div
        v-for="competence in competences"
        :key="competence.nom"
        :class="['competence-item', {
          'on-cooldown': isOnCooldown(competence),
          'selected': isSelected(competence)
        }]"
        @click="selectCompetence(competence)"
      >
        <!-- Nom et type de la compétence -->
        <div class="competence-header">
          <span class="competence-name">{{ competence.nom }}</span>
          <span class="competence-type">{{ competence.type }}</span>
        </div>

        <!-- Voie de la compétence -->
        <div class="competence-voie">
          {{ competence.voie }}
        </div>

        <!-- Message de cooldown si applicable -->
        <div v-if="isOnCooldown(competence)" class="cooldown-message">
          Disponible dans {{ getRemainingCooldown(competence) }} tour(s)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetenceSelector',

  props: {
    // Liste des compétences disponibles
    competences: {
      type: Array,
      required: true
    },
    // Tour actuel du combat
    counter: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      // Compétence actuellement sélectionnée
      selectedCompetence: null
    }
  },

  methods: {
    // Vérifie si une compétence est en cooldown
    isOnCooldown(competence) {
      return competence.cooldownEnd && competence.cooldownEnd > this.counter
    },

    // Calcule le nombre de tours restants avant la fin du cooldown
    getRemainingCooldown(competence) {
      return competence.cooldownEnd - this.counter
    },

    // Vérifie si une compétence est sélectionnée
    isSelected(competence) {
      return this.selectedCompetence === competence
    },

    // Sélectionne une compétence si elle n'est pas en cooldown
    selectCompetence(competence) {
      if (this.isOnCooldown(competence)) {
        return // Ne fait rien si la compétence est en cooldown
      }

      this.selectedCompetence = competence
      this.$emit('select-competence', competence)
    }
  }
}
</script>

<style scoped>
.competence-selector {
  margin: 15px 0;
}

.competences-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.competence-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.competence-item:not(.on-cooldown):hover {
  border-color: #2c6578;
  transform: translateY(-2px);
}

.competence-item.selected {
  background-color: #2c6578;
  color: white;
  border-color: #2c6578;
}

.competence-item.on-cooldown {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.competence-name {
  font-weight: bold;
}

.competence-type {
  font-size: 0.9em;
  color: #666;
}

.competence-voie {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 5px;
}

.cooldown-message {
  font-size: 0.8em;
  color: #f44336;
  margin-top: 5px;
}

/* Styles spécifiques selon le type de compétence */
.competence-item[data-type="Attaque"] .competence-type {
  color: #f44336;
}

.competence-item[data-type="Soin"] .competence-type {
  color: #4caf50;
}

.competence-item[data-type="Défense"] .competence-type {
  color: #2196f3;
}
</style> 