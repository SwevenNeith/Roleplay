<!-- Composant qui gère la liste des participants au combat -->
<template>
  <div class="combat-participant-list">
    <h2>Participants Potentiels</h2>
    
    <!-- Liste des personnages disponibles -->
    <div class="participant-grid">
      <div
        v-for="character in characters"
        :key="character._id"
        :class="['participant-item', { selected: isSelected(character._id) }]"
        @click="$emit('select', character._id)"
      >
        <!-- Informations du personnage -->
        <div class="participant-header">
          <strong>{{ character.nom }}</strong>
        </div>
        <div class="participant-details">
          <span>Race: {{ character.race }}</span>
          <span>Classe: {{ character.classe }}</span>
          <span>PV: {{ character.pv[0] }}/{{ character.pv[1] }}</span>
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

      <!-- Bouton pour lancer l'initiative (visible uniquement si des participants sont sélectionnés) -->
      <button
        v-if="selectedParticipants.length > 0"
        @click="$emit('start-initiative')"
        class="start-btn"
      >
        Lancer l'initiative
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CombatParticipantList',

  props: {
    // Liste complète des personnages disponibles
    characters: {
      type: Array,
      required: true
    },
    // IDs des participants sélectionnés
    selectedParticipants: {
      type: Array,
      required: true
    }
  },

  methods: {
    // Vérifie si un personnage est sélectionné
    isSelected(characterId) {
      return this.selectedParticipants.includes(characterId)
    }
  }
}
</script>

<style scoped>
.combat-participant-list {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

.participant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.participant-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.participant-item:hover {
  border-color: #2c6578;
  transform: translateY(-2px);
}

.participant-item.selected {
  background-color: #2c6578;
  color: white;
  border-color: #2c6578;
}

.participant-header {
  margin-bottom: 10px;
  font-size: 1.1em;
}

.participant-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.9em;
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

.start-btn:hover {
  background-color: #c8aa6e;
  color: #2c6578;
}
</style> 