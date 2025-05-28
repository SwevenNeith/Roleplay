<!-- 
  CombatModals.vue
  ---------------
  Ce composant gère les modales qui apparaissent lors de l'utilisation d'une compétence :
  - Modale de succès/échec : détermine si la compétence réussit
  - Modale de dégâts/effets : permet de saisir les valeurs d'effet (dégâts, soins, défense)
-->
<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <!-- Modale de succès/échec -->
    <div v-if="!showDamageModal" class="modal-content">
      <h3>La compétence est-elle réussie ?</h3>

      <!-- Informations sur la compétence -->
      <div class="competence-info">
        <div class="competence-header">
          <span class="competence-name">{{ competence.nom }}</span>
          <span :class="['competence-type', `type-${competence.type.toLowerCase()}`]">
            {{ competence.type }}
          </span>
        </div>
        <div class="competence-voie">{{ competence.voie }}</div>
      </div>

      <!-- Informations sur la cible -->
      <div class="target-info">
        <strong>Cible :</strong> {{ target.nom }}
        <div class="target-stats">
          <span>PV : {{ target.pv[0] }}/{{ target.pv[1] }}</span>
          <span>Armure : {{ target.armure }}</span>
          <span>Défense : {{ target.defenseValue || 0 }}</span>
        </div>
      </div>

      <!-- Sélection du résultat -->
      <div class="success-selection">
        <label>
          <input 
            type="radio" 
            v-model="success" 
            :value="true"
          > Réussite
        </label>
        <label>
          <input 
            type="radio" 
            v-model="success" 
            :value="false"
          > Échec
        </label>
      </div>

      <!-- Boutons d'action -->
      <div class="modal-actions">
        <button @click="$emit('cancel')" class="cancel-btn">
          Annuler
        </button>
        <button 
          @click="handleSuccess"
          :disabled="success === null"
          class="confirm-btn"
        >
          Confirmer
        </button>
      </div>
    </div>

    <!-- Modale de dégâts/effets -->
    <div v-else class="modal-content">
      <h3>{{ getDamageModalTitle }}</h3>

      <!-- Informations sur la compétence -->
      <div class="competence-info">
        <div class="competence-header">
          <span class="competence-name">{{ competence.nom }}</span>
          <span :class="['competence-type', `type-${competence.type.toLowerCase()}`]">
            {{ competence.type }}
          </span>
        </div>
        <div class="competence-voie">{{ competence.voie }}</div>
      </div>

      <!-- Informations sur la cible -->
      <div class="target-info">
        <strong>Cible :</strong> {{ target.nom }}
        <div class="target-stats">
          <span>PV : {{ target.pv[0] }}/{{ target.pv[1] }}</span>
          <span>Armure : {{ target.armure }}</span>
          <span>Défense : {{ target.defenseValue || 0 }}</span>
        </div>
      </div>

      <!-- Saisie de la valeur d'effet -->
      <div class="damage-input">
        <input 
          type="number"
          v-model.number="damageValue"
          :placeholder="getDamageInputPlaceholder"
          min="0"
          class="value-input"
        >
      </div>

      <!-- Boutons d'action -->
      <div class="modal-actions">
        <button @click="backToSuccess" class="back-btn">
          Retour
        </button>
        <button 
          @click="applyDamage"
          :disabled="!isValidDamage"
          class="confirm-btn"
        >
          Appliquer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CombatModals',

  props: {
    // Compétence utilisée
    competence: {
      type: Object,
      required: true
    },
    // Cible de la compétence
    target: {
      type: Object,
      required: true
    },
    // Participant qui utilise la compétence
    attacker: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // État de réussite de la compétence (true/false/null)
      success: null,
      // Valeur de l'effet (dégâts, soins, défense)
      damageValue: null,
      // Contrôle l'affichage de la modale de dégâts
      showDamageModal: false
    }
  },

  computed: {
    // Détermine le titre de la modale de dégâts selon le type de compétence
    getDamageModalTitle() {
      switch (this.competence.type) {
        case 'Attaque':
          return 'Entrez les dégâts'
        case 'Soin':
          return 'Entrez la valeur de soin'
        case 'Défense':
          return 'Entrez la valeur de défense'
        default:
          return 'Entrez la valeur'
      }
    },

    // Détermine le placeholder de l'input selon le type de compétence
    getDamageInputPlaceholder() {
      switch (this.competence.type) {
        case 'Attaque':
          return 'Dégâts'
        case 'Soin':
          return 'Soin'
        case 'Défense':
          return 'Défense'
        default:
          return 'Valeur'
      }
    },

    // Vérifie si la valeur d'effet est valide
    isValidDamage() {
      return typeof this.damageValue === 'number' && this.damageValue >= 0
    }
  },

  methods: {
    // Gère la validation du succès/échec
    handleSuccess() {
      if (this.success === false) {
        // En cas d'échec, émet directement le résultat
        this.$emit('apply', {
          success: false,
          damage: 0
        })
      } else {
        // En cas de succès, passe à la modale de dégâts
        this.showDamageModal = true
      }
    },

    // Retourne à la modale de succès/échec
    backToSuccess() {
      this.showDamageModal = false
      this.damageValue = null
    },

    // Applique les effets de la compétence
    applyDamage() {
      if (this.isValidDamage) {
        this.$emit('apply', {
          success: true,
          damage: this.damageValue
        })
      }
    }
  }
}
</script>

<style scoped>
/* Overlay semi-transparent */
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

/* Conteneur de la modale */
.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
}

/* Informations sur la compétence */
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

/* Informations sur la cible */
.target-info {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.target-stats {
  display: flex;
  gap: 15px;
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}

/* Sélection du succès/échec */
.success-selection {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 20px 0;
}

.success-selection label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Zone de saisie des dégâts */
.damage-input {
  margin: 20px 0;
  text-align: center;
}

.value-input {
  width: 100px;
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.1em;
}

/* Boutons d'action */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Styles des boutons */
.cancel-btn,
.back-btn,
.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cancel-btn,
.back-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover,
.back-btn:hover {
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
</style> 