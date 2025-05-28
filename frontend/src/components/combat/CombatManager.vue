<!-- Composant principal qui gère l'état global du combat -->
<template>
  <div class="combat-manager">
    <!-- Bouton pour démarrer un nouveau combat -->
    <button 
      v-if="!showCombatList && !showInitiativePhase && !showCombatPhase" 
      @click="startNewCombat" 
      class="combat-btn"
    >
      Commencer un combat
    </button>

    <!-- Composant de sélection des participants -->
    <CombatParticipantList
      v-if="showCombatList"
      :characters="characters"
      :selectedParticipants="selectedCombatCharacters"
      @select="toggleParticipant"
      @cancel="cancelCombat"
      @start-initiative="startInitiativePhase"
    />

    <!-- Phase d'initiative -->
    <InitiativePhase
      v-if="showInitiativePhase"
      :participants="selectedCombatParticipants"
      @update:initiative="updateInitiative"
      @cancel="cancelInitiative"
      @start-combat="startCombatPhase"
    />

    <!-- Phase de combat -->
    <CombatPhase
      v-if="showCombatPhase"
      :participants="sortedCombatParticipants"
      :currentParticipantIndex="selectedParticipantIndex"
      :counter="counter"
      @end-round="endRound"
      @end-combat="endCombat"
      @update:participant="updateParticipant"
    />

    <!-- Message de sauvegarde -->
    <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>
  </div>
</template>

<script>
import CombatParticipantList from './CombatParticipantList.vue'
import InitiativePhase from './InitiativePhase.vue'
import CombatPhase from './CombatPhase.vue'
import axios from 'axios'

export default {
  name: 'CombatManager',
  
  components: {
    CombatParticipantList,
    InitiativePhase,
    CombatPhase
  },

  props: {
    // Liste des personnages disponibles
    characters: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      // États d'affichage des différentes phases
      showCombatList: false,
      showInitiativePhase: false,
      showCombatPhase: false,
      
      // Données du combat
      selectedCombatCharacters: [], // IDs des personnages sélectionnés
      selectedCombatParticipants: [], // Données complètes des participants
      selectedParticipantIndex: 0, // Index du participant actuel
      counter: 1, // Compteur de tours
      combatLog: [], // Journal du combat
      saveMessage: '' // Message de sauvegarde
    }
  },

  computed: {
    // Trie les participants par initiative décroissante
    sortedCombatParticipants() {
      return [...this.selectedCombatParticipants].sort((a, b) => b.initiative - a.initiative)
    }
  },

  methods: {
    // Démarre un nouveau combat
    startNewCombat() {
      this.showCombatList = true
      this.resetCombatData()
    },

    // Réinitialise les données du combat
    resetCombatData() {
      this.selectedCombatCharacters = []
      this.selectedCombatParticipants = []
      this.selectedParticipantIndex = 0
      this.counter = 1
      this.combatLog = []
    },

    // Ajoute/retire un participant
    toggleParticipant(charId) {
      const index = this.selectedCombatCharacters.indexOf(charId)
      if (index === -1) {
        this.selectedCombatCharacters.push(charId)
      } else {
        this.selectedCombatCharacters.splice(index, 1)
      }
    },

    // Annule le combat en cours
    cancelCombat() {
      this.showCombatList = false
      this.resetCombatData()
    },

    // Démarre la phase d'initiative
    startInitiativePhase() {
      this.showCombatList = false
      this.showInitiativePhase = true
      // Prépare les participants avec leur initiative
      this.selectedCombatParticipants = this.characters
        .filter(char => this.selectedCombatCharacters.includes(char._id))
        .map(char => ({ ...char, initiative: 0 }))
    },

    // Met à jour l'initiative d'un participant
    updateInitiative({ participantId, value }) {
      const participant = this.selectedCombatParticipants.find(p => p._id === participantId)
      if (participant) {
        participant.initiative = Math.min(30, Math.max(0, value)) // Limite entre 0 et 30
      }
    },

    // Annule la phase d'initiative
    cancelInitiative() {
      this.showInitiativePhase = false
      this.showCombatList = true
    },

    // Démarre la phase de combat
    startCombatPhase() {
      this.showInitiativePhase = false
      this.showCombatPhase = true
      this.selectedParticipantIndex = 0 // Commence avec le premier participant
    },

    // Termine le tour d'un participant
    endRound() {
      this.selectedParticipantIndex++
      if (this.selectedParticipantIndex >= this.sortedCombatParticipants.length) {
        this.selectedParticipantIndex = 0
        this.counter++
      }
    },

    // Met à jour les données d'un participant
    updateParticipant({ participantId, data }) {
      const index = this.selectedCombatParticipants.findIndex(p => p._id === participantId)
      if (index !== -1) {
        this.selectedCombatParticipants[index] = { ...this.selectedCombatParticipants[index], ...data }
      }
    },

    // Termine le combat et sauvegarde les données
    async endCombat() {
      try {
        // Prépare les données du combat pour la sauvegarde
        const combatData = {
          date: new Date().toISOString().split('T')[0],
          participants: this.sortedCombatParticipants.map(p => ({
            nom: p.nom,
            initiative: p.initiative,
            pvDebut: [...p.pv]
          })),
          tours: this.combatLog,
          pvFinaux: this.sortedCombatParticipants.map(p => ({
            nom: p.nom,
            pvFin: [p.pv[0], p.pv[1]]
          })),
          nombreTours: this.counter
        }

        // Sauvegarde les données
        await axios.post('http://localhost:3000/api/combats', combatData)
        
        // Réinitialise l'interface
        this.showCombatPhase = false
        this.resetCombatData()
        
        // Affiche le message de succès
        this.saveMessage = 'Combat terminé et sauvegardé avec succès'
        setTimeout(() => {
          this.saveMessage = ''
        }, 3000)
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du combat:', error)
        this.saveMessage = 'Erreur lors de la sauvegarde du combat'
      }
    }
  }
}
</script>

<style scoped>
.combat-manager {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.combat-btn {
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.combat-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}

.save-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  background-color: #e8f5e9;
  color: #2e7d32;
}
</style> 