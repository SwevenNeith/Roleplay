<!--
  Composant de modale pour l'attribution d'expérience après un combat
  Permet de :
  - Voir l'XP actuelle de chaque participant
  - Attribuer de l'XP individuellement
  - Visualiser le niveau actuel et le maximum d'XP possible
-->
<template>
  <!-- Overlay semi-transparent qui couvre tout l'écran -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Attribution de l'expérience</h3>
      
      <!-- Formulaire d'attribution d'XP -->
      <div class="xp-form">
        <!-- Liste des participants avec leurs informations d'XP -->
        <div v-for="participant in participants" :key="participant.nom" class="participant-xp">
          <label>{{ participant.nom }}</label>
          <div class="xp-input-group">
            <!-- Champ de saisie pour l'XP gagnée -->
            <input 
              type="number" 
              v-model.number="experienceValues[participant.nom]" 
              min="0"
              placeholder="XP gagnée"
            >
            <!-- Affichage de l'XP actuelle et du niveau -->
            <span class="current-xp">
              XP actuelle: {{ participant.experienceActuelle }}/{{ getMaxXP(participant.niveau) }}
              (Niveau {{ participant.niveau }})
            </span>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn-cancel">Annuler</button>
        <button @click="submitExperience" class="btn-save">Valider</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExperienceModal',
  
  // Props reçues du composant parent
  props: {
    participants: {
      type: Array,
      required: true
      // Chaque participant doit avoir : nom, niveau, experienceActuelle
    }
  },

  // État local du composant
  data() {
    return {
      experienceValues: {} // Stocke l'XP attribuée à chaque participant
    }
  },

  // Initialisation du composant
  created() {
    // Initialise les valeurs d'XP à 0 pour chaque participant
    this.participants.forEach(p => {
      this.experienceValues[p.nom] = 0;
    });
  },

  methods: {
    // Calcule l'XP maximum pour un niveau donné
    getMaxXP(niveau) {
      return niveau * 100; // Niveau 1 = 100 XP, Niveau 2 = 200 XP, etc.
    },

    // Émet l'événement de soumission avec les valeurs d'XP
    submitExperience() {
      this.$emit('submit', this.experienceValues);
    }
  }
}
</script>

<style scoped>
/* Styles pour l'overlay de la modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Style du contenu de la modale */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

/* Styles du formulaire d'XP */
.xp-form {
  margin: 20px 0;
}

.participant-xp {
  margin-bottom: 15px;
}

/* Style du groupe d'input d'XP */
.xp-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

/* Style de l'input numérique */
.xp-input-group input {
  width: 100px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Style de l'affichage de l'XP actuelle */
.current-xp {
  color: #666;
  font-size: 0.9em;
}

/* Style des boutons d'action */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Styles des boutons */
.btn-save,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save {
  background: #4CAF50;
  color: white;
}

.btn-cancel {
  background: #9e9e9e;
  color: white;
}

/* Effets de survol */
.btn-save:hover {
  background: #388E3C;
}

.btn-cancel:hover {
  background: #757575;
}
</style> 