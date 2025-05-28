<!-- 
  CombatPhase.vue
  --------------
  Ce composant gère la phase principale du combat. Il affiche :
  - La liste des participants avec leurs statistiques
  - Les compétences du participant actif
  - Les modales pour la sélection des cibles et les effets
  - Les boutons de contrôle du combat
-->
<template>
  <div class="combat-phase">
    <!-- En-tête avec le numéro du tour -->
    <h2>Phase de Combat - Tour {{ counter }}</h2>

    <!-- Liste des participants au combat -->
    <div class="participants-list">
      <!-- Chaque participant est affiché dans une carte -->
      <div
        v-for="(participant, index) in participants"
        :key="participant._id"
        :class="['participant-item', { active: index === currentParticipantIndex }]"
      >
        <!-- En-tête de la carte avec le nom et l'initiative -->
        <div class="participant-header">
          <span class="participant-name">{{ participant.nom }}</span>
          <span class="participant-initiative">Initiative: {{ participant.initiative }}</span>
        </div>

        <!-- Statistiques principales du participant -->
        <div class="participant-stats">
          <span>PV: {{ participant.pv[0] }}/{{ participant.pv[1] }}</span>
          <span>Armure: {{ participant.armure }}</span>
          <span>Défense: {{ participant.defenseValue || 0 }}</span>
        </div>

        <!-- Section des actions - visible uniquement pour le participant actif -->
        <div v-if="index === currentParticipantIndex" class="participant-actions">
          <!-- Liste des compétences disponibles -->
          <div class="participant-competences">
            <h4>Compétences disponibles :</h4>
            <div class="competences-grid">
              <!-- Chaque compétence est affichée dans une carte cliquable -->
              <div
                v-for="competence in participant.competences"
                :key="competence.nom"
                :class="['competence-item', {
                  'on-cooldown': isCompetenceOnCooldown(competence),
                  'selected': isCompetenceSelected(competence)
                }]"
                @click="selectCompetence(competence)"
              >
                <!-- En-tête de la compétence avec nom et type -->
                <div class="competence-header">
                  <span class="competence-name">{{ competence.nom }}</span>
                  <span :class="['competence-type', `type-${competence.type.toLowerCase()}`]">
                    {{ competence.type }}
                  </span>
                </div>
                <!-- Voie de la compétence -->
                <div class="competence-voie">{{ competence.voie }}</div>
                <!-- Message de cooldown si la compétence n'est pas disponible -->
                <div v-if="isCompetenceOnCooldown(competence)" class="cooldown-message">
                  Disponible dans {{ getRemainingCooldown(competence) }} tour(s)
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton pour terminer le tour du participant actif -->
          <button @click="endTurn" class="end-turn-btn">
            Fin du tour
          </button>
        </div>
      </div>
    </div>

    <!-- Modale pour sélectionner la cible de la compétence -->
    <TargetSelector
      v-if="showTargetModal"
      :participants="participants"
      :currentParticipant="participants[currentParticipantIndex]"
      :selectedCompetence="selectedCompetence"
      @select="handleTargetSelection"
      @cancel="cancelTargetSelection"
    />

    <!-- Modale pour gérer les effets de la compétence -->
    <CombatModals
      v-if="showEffectModal"
      :competence="selectedCompetence"
      :target="selectedTarget"
      :attacker="participants[currentParticipantIndex]"
      @apply="applyEffect"
      @cancel="cancelEffect"
    />

    <!-- Bouton pour terminer le combat -->
    <button @click="endCombat" class="end-combat-btn">
      Terminer le combat
    </button>
  </div>
</template>

<script>
import CompetenceSelector from './CompetenceSelector.vue'
import TargetSelector from './TargetSelector.vue'
import CombatModals from './CombatModals.vue'

export default {
  name: 'CombatPhase',

  components: {
    CompetenceSelector,
    TargetSelector,
    CombatModals
  },

  props: {
    // Liste des participants triée par initiative
    participants: {
      type: Array,
      required: true
    },
    // Index du participant actuellement actif
    currentParticipantIndex: {
      type: Number,
      required: true
    },
    // Numéro du tour actuel
    counter: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      // Compétence actuellement sélectionnée
      selectedCompetence: null,
      // Cible sélectionnée pour la compétence
      selectedTarget: null,
      // États d'affichage des modales
      showTargetModal: false, // Modale de sélection de cible
      showEffectModal: false  // Modale des effets
    }
  },

  methods: {
    // Vérifie si une compétence est en période de récupération
    isCompetenceOnCooldown(competence) {
      return competence.cooldownEnd && competence.cooldownEnd > this.counter
    },

    // Calcule le nombre de tours restants avant de pouvoir réutiliser la compétence
    getRemainingCooldown(competence) {
      return competence.cooldownEnd - this.counter
    },

    // Vérifie si une compétence est actuellement sélectionnée
    isCompetenceSelected(competence) {
      return this.selectedCompetence === competence
    },

    // Gère la sélection d'une compétence
    selectCompetence(competence) {
      // Vérifie si la compétence est utilisable
      if (this.isCompetenceOnCooldown(competence)) {
        return // Ne fait rien si la compétence est en cooldown
      }

      // Active la sélection de cible
      this.selectedCompetence = competence
      this.showTargetModal = true
    },

    // Gère la sélection d'une cible
    handleTargetSelection(target) {
      this.selectedTarget = target
      this.showTargetModal = false
      this.showEffectModal = true // Passe à la modale des effets
    },

    // Annule la sélection de la cible
    cancelTargetSelection() {
      this.selectedCompetence = null
      this.showTargetModal = false
    },

    // Applique les effets de la compétence
    applyEffect({ success, damage }) {
      const attacker = this.participants[this.currentParticipantIndex]
      const target = this.selectedTarget

      // Met à jour le cooldown de la compétence utilisée
      if (this.selectedCompetence) {
        this.selectedCompetence.cooldownEnd = this.counter + 3 // 3 tours de récupération
      }

      // Applique les effets si la compétence est réussie
      if (success) {
        switch (this.selectedCompetence.type) {
          case 'Attaque':
            // Calcule les dégâts en tenant compte de la défense
            const finalDamage = Math.max(0, damage - (target.defenseValue || 0))
            target.pv[0] = Math.max(0, target.pv[0] - finalDamage)
            target.defenseValue = 0 // Réinitialise la défense
            break
          case 'Soin':
            // Soigne sans dépasser les PV maximum
            target.pv[0] = Math.min(target.pv[1], target.pv[0] + damage)
            break
          case 'Défense':
            // Applique la valeur de défense
            target.defenseValue = damage
            break
        }

        // Notifie le parent des changements
        this.$emit('update:participant', {
          participantId: target._id,
          data: target
        })
      }

      // Réinitialise l'état après l'application des effets
      this.selectedCompetence = null
      this.selectedTarget = null
      this.showEffectModal = false
    },

    // Annule l'application des effets
    cancelEffect() {
      this.selectedCompetence = null
      this.selectedTarget = null
      this.showEffectModal = false
    },

    // Termine le tour du participant actif
    endTurn() {
      this.$emit('end-round')
    },

    // Termine le combat
    endCombat() {
      this.$emit('end-combat')
    }
  }
}
</script>

<style scoped>
/* Conteneur principal de la phase de combat */
.combat-phase {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

/* Liste des participants */
.participants-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

/* Carte de participant */
.participant-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

/* Style spécial pour le participant actif */
.participant-item.active {
  border-color: #2c6578;
  background-color: #f0f7fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* En-tête de la carte de participant */
.participant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.participant-name {
  font-weight: bold;
  font-size: 1.1em;
}

.participant-initiative {
  color: #666;
}

/* Statistiques du participant */
.participant-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

/* Section des actions du participant */
.participant-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

/* Section des compétences */
.participant-competences {
  margin-bottom: 15px;
}

.participant-competences h4 {
  margin-bottom: 10px;
  color: #2c6578;
}

/* Grille des compétences */
.competences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

/* Carte de compétence */
.competence-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Effets de survol et de sélection */
.competence-item:not(.on-cooldown):hover {
  border-color: #2c6578;
  transform: translateY(-2px);
}

.competence-item.selected {
  background-color: #2c6578;
  color: white;
  border-color: #2c6578;
}

/* Style pour les compétences en cooldown */
.competence-item.on-cooldown {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

/* En-tête de la carte de compétence */
.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.competence-name {
  font-weight: bold;
}

/* Style des types de compétence */
.competence-type {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.type-attaque {
  background-color: #ffebee;
  color: #f44336;
}

.type-soin {
  background-color: #e8f5e9;
  color: #4caf50;
}

.type-defense {
  background-color: #e3f2fd;
  color: #2196f3;
}

/* Informations supplémentaires de la compétence */
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

/* Bouton de fin de tour */
.end-turn-btn {
  background-color: #2c6578;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.end-turn-btn:hover {
  background-color: #c8aa6e;
  color: #2c6578;
}

/* Bouton de fin de combat */
.end-combat-btn {
  margin-top: 20px;
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.end-combat-btn:hover {
  background-color: #d32f2f;
}
</style> 