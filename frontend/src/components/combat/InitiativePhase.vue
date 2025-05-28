<!-- Composant qui gère la phase d'initiative du combat -->
<template>
  <div class="initiative-phase">
    <h2>Phase d'Initiative</h2>
    
    <!-- Liste des participants avec leurs valeurs d'initiative -->
    <div class="initiative-list">
      <div
        v-for="participant in participants"
        :key="participant._id"
        class="initiative-item"
      >
        <!-- Nom du participant -->
        <div class="participant-name">
          {{ participant.nom }}
        </div>

        <!-- Input pour l'initiative -->
        <div class="initiative-input-container">
          <input
            type="number"
            v-model.number="initiativeValues[participant._id]"
            @input="updateInitiative(participant._id)"
            min="0"
            max="30"
            class="initiative-input"
            placeholder="Initiative"
          />
          <!-- Message d'erreur si la valeur est invalide -->
          <span v-if="initiativeErrors[participant._id]" class="error-message">
            {{ initiativeErrors[participant._id] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="action-buttons">
      <!-- Bouton Annuler -->
      <button 
        @click="$emit('cancel')" 
        class="cancel-btn"
      >
        Annuler
      </button>

      <!-- Bouton pour démarrer le combat -->
      <button
        @click="startCombat"
        :disabled="!isValid"
        class="start-btn"
      >
        Démarrer le combat
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitiativePhase',

  props: {
    // Liste des participants au combat
    participants: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      // Stocke les valeurs d'initiative pour chaque participant
      initiativeValues: {},
      // Stocke les messages d'erreur pour chaque participant
      initiativeErrors: {}
    }
  },

  computed: {
    // Vérifie si toutes les initiatives sont valides
    isValid() {
      return this.participants.every(p => {
        const value = this.initiativeValues[p._id]
        return value !== undefined && value >= 0 && value <= 30 && !this.initiativeErrors[p._id]
      })
    }
  },

  methods: {
    // Met à jour l'initiative d'un participant
    updateInitiative(participantId) {
      const value = this.initiativeValues[participantId]
      
      // Vérifie la validité de la valeur
      if (value === undefined || value === '') {
        this.initiativeErrors[participantId] = 'Initiative requise'
      } else if (value < 0) {
        this.initiativeErrors[participantId] = 'Minimum 0'
        this.initiativeValues[participantId] = 0
      } else if (value > 30) {
        this.initiativeErrors[participantId] = 'Maximum 30'
        this.initiativeValues[participantId] = 30
      } else {
        this.initiativeErrors[participantId] = ''
      }

      // Émet l'événement de mise à jour
      this.$emit('update:initiative', {
        participantId,
        value: this.initiativeValues[participantId]
      })
    },

    // Démarre le combat si toutes les initiatives sont valides
    startCombat() {
      if (this.isValid) {
        this.$emit('start-combat')
      }
    }
  },

  // Initialise les valeurs d'initiative au montage du composant
  created() {
    this.participants.forEach(p => {
      this.initiativeValues[p._id] = p.initiative || 0
      this.initiativeErrors[p._id] = ''
    })
  }
}
</script>

<style scoped>
.initiative-phase {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

.initiative-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.initiative-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.participant-name {
  font-weight: bold;
  font-size: 1.1em;
}

.initiative-input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.initiative-input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 1em;
}

.initiative-input:focus {
  border-color: #2c6578;
  outline: none;
}

.error-message {
  color: #f44336;
  font-size: 0.8em;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.cancel-btn, .start-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.start-btn {
  background-color: #2c6578;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #c8aa6e;
  color: #2c6578;
}

.start-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 