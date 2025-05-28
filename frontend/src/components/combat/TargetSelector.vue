<!-- 
  TargetSelector.vue
  -----------------
  Ce composant gère la sélection des cibles lors de l'utilisation d'une compétence.
  Il affiche une modale avec la liste des cibles disponibles en fonction du type de compétence :
  - Attaque : tous les participants sauf l'attaquant
  - Soin : tous les participants
  - Défense : uniquement l'utilisateur de la compétence
-->
<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="target-selector">
      <h3>Sélectionner une cible</h3>

      <!-- Informations sur la compétence utilisée -->
      <div class="competence-info">
        <div class="competence-header">
          <span class="competence-name">{{ selectedCompetence.nom }}</span>
          <span :class="['competence-type', typeClass]">{{ selectedCompetence.type }}</span>
        </div>
        <div class="competence-voie">{{ selectedCompetence.voie }}</div>
      </div>

      <!-- Liste des cibles potentielles -->
      <div class="targets-list">
        <!-- Chaque cible est affichée avec ses statistiques -->
        <div
          v-for="target in availableTargets"
          :key="target._id"
          :class="['target-item', { 
            selected: isSelected(target),
            'self-target': isSelfTarget(target)
          }]"
          @click="selectTarget(target)"
        >
          <!-- En-tête avec le nom et les PV -->
          <div class="target-header">
            <span class="target-name">{{ target.nom }}</span>
            <span class="target-stats">
              PV: {{ target.pv[0] }}/{{ target.pv[1] }}
            </span>
          </div>

          <!-- Statistiques de défense -->
          <div class="target-details">
            <span>Armure: {{ target.armure }}</span>
            <span>Défense: {{ target.defenseValue || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="action-buttons">
        <button @click="$emit('cancel')" class="cancel-btn">
          Annuler
        </button>
        <button 
          @click="confirmTarget"
          :disabled="!selectedTarget"
          class="confirm-btn"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetSelector',

  props: {
    // Liste complète des participants au combat
    participants: {
      type: Array,
      required: true
    },
    // Participant qui utilise la compétence
    currentParticipant: {
      type: Object,
      required: true
    },
    // Compétence sélectionnée à utiliser
    selectedCompetence: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // Cible sélectionnée pour la compétence
      selectedTarget: null
    }
  },

  computed: {
    // Détermine la classe CSS en fonction du type de compétence
    typeClass() {
      return `type-${this.selectedCompetence.type.toLowerCase()}`
    },

    // Filtre les cibles disponibles selon le type de compétence
    availableTargets() {
      switch (this.selectedCompetence.type) {
        case 'Soin':
          // Les soins peuvent cibler n'importe quel participant
          return this.participants
        case 'Défense':
          // Les compétences de défense ne peuvent cibler que soi-même
          return [this.currentParticipant]
        case 'Attaque':
          // Les attaques peuvent cibler tous les participants sauf soi-même
          return this.participants.filter(p => p._id !== this.currentParticipant._id)
        default:
          return this.participants
      }
    }
  },

  methods: {
    // Vérifie si une cible est actuellement sélectionnée
    isSelected(target) {
      return this.selectedTarget === target
    },

    // Vérifie si la cible est le participant actif
    isSelfTarget(target) {
      return target._id === this.currentParticipant._id
    },

    // Sélectionne une nouvelle cible
    selectTarget(target) {
      this.selectedTarget = target
    },

    // Confirme la sélection de la cible
    confirmTarget() {
      if (this.selectedTarget) {
        this.$emit('select', this.selectedTarget)
      }
    }
  }
}
</script>

<style scoped>
/* Overlay semi-transparent qui couvre tout l'écran */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Conteneur principal de la modale */
.target-selector {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

/* Section d'information sur la compétence */
.competence-info {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

/* En-tête de la compétence */
.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.competence-name {
  font-weight: bold;
  font-size: 1.1em;
}

/* Styles des types de compétence */
.competence-type {
  padding: 4px 8px;
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

/* Voie de la compétence */
.competence-voie {
  margin-top: 5px;
  color: #666;
  font-size: 0.9em;
}

/* Liste des cibles disponibles */
.targets-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

/* Carte de cible */
.target-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Effets de survol et de sélection */
.target-item:hover {
  border-color: #2c6578;
  transform: translateY(-2px);
}

.target-item.selected {
  background-color: #2c6578;
  color: white;
  border-color: #2c6578;
}

/* Style spécial pour l'auto-ciblage */
.target-item.self-target {
  background-color: #f5f5f5;
}

/* En-tête de la carte de cible */
.target-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.target-name {
  font-weight: bold;
}

.target-stats {
  font-size: 0.9em;
}

/* Détails de la cible */
.target-details {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

/* Conteneur des boutons d'action */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Style des boutons */
.cancel-btn, .confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
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

.confirm-btn {
  background-color: #2c6578;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #c8aa6e;
  color: #2c6578;
}

.confirm-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 