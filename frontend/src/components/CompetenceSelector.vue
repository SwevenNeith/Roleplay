<!--
  Ce composant affiche un sélecteur de compétences.
  Il permet de sélectionner une compétence et de choisir son type.
  Il permet de valider la compétence.
  Il permet d'annuler la sélection.
-->

<template>
  <div class="competence-selector">
    <!-- État initial : bouton pour ajouter une compétence -->
    <button 
      v-if="!showSelector" 
      @click="showSelector = true" 
      class="add-competence-btn"
    >
      Ajouter une compétence
    </button>

    <!-- État de sélection : dropdown des voies -->
    <div v-else-if="!selectedVoie" class="voie-selector">
      <h4>Sélectionnez une voie</h4>
      <select v-model="selectedVoie" class="voie-dropdown">
        <option value="">Choisir une voie</option>
        <option 
          v-for="voie in voies" 
          :key="voie.slug" 
          :value="voie.slug"
        >
          {{ voie.nom }}
        </option>
      </select>
      <button @click="showSelector = false" class="cancel-btn">Annuler</button>
    </div>

    <!-- État de sélection : liste des compétences -->
    <div v-else class="competence-list">
      <h4>Compétences de la voie {{ selectedVoieNom }}</h4>
      <div class="competences-grid">
        <div 
          v-for="competence in competencesDeLaVoie" 
          :key="competence.slug || competence.nom"
          :class="['competence-item', { disabled: isCompetenceAdded(competence) }]"
        >
          <strong>{{ competence.nom }}</strong>
          <span class="competence-type">{{ competence.type || competence.description }}</span>
          <button
            v-if="!isCompetenceAdded(competence)"
            @click="selectCompetence(competence)"
            class="choose-type-btn"
          >
            Sélectionner
          </button>
          <!-- Si c'est la compétence sélectionnée, afficher le choix du type -->
          <div v-if="competence.slug === selectedCompetence?.slug" class="type-selection">
            <label>Type&nbsp;:
              <select v-model="selectedType">
                <option value="">Choisir un type</option>
                <option value="Attaque">Attaque</option>
                <option value="Soin">Soin</option>
                <option value="Défense">Défense</option>
              </select>
            </label>
            <button @click="validateCompetence" :disabled="!selectedType" class="validate-btn">Valider</button>
            <button @click="cancelTypeSelection" class="cancel-btn">Annuler</button>
          </div>
        </div>
      </div>
      <button @click="selectedVoie = null" class="back-btn">Retour aux voies</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetenceSelector',
  props: {
    classe: {
      type: String,
      required: true
    },
    existingCompetences: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showSelector: false,
      selectedVoie: null,
      voies: [], // Contiendra toutes les voies
      competencesDeLaVoie: [], // Compétences de la voie sélectionnée
      selectedCompetence: null,
      selectedType: ''
    };
  },
  computed: {
    selectedVoieNom() {
      const voie = this.voies.find(v => v.slug === this.selectedVoie);
      return voie ? voie.nom : '';
    }
  },
  watch: {
    classe: {
      immediate: true,
      handler(newClasse) {
        if (newClasse) {
          this.fetchVoies();
        } else {
          this.voies = [];
          this.selectedVoie = null;
        }
      }
    },
    selectedVoie: {
      immediate: false,
      async handler(newVoieSlug) {
        if (newVoieSlug) {
          await this.fetchCompetencesDeLaVoie(newVoieSlug);
        } else {
          this.competencesDeLaVoie = [];
        }
      }
    },
    showSelector(val) {
      if (!val) {
        this.selectedVoie = null;
        this.selectedCompetence = null;
        this.selectedType = '';
      }
    }
  },
  methods: {
    async fetchVoies() {
      try {
        const response = await fetch(`http://localhost:3000/api/classes/${this.classe}`);
        const data = await response.json();
        this.voies = data.voies || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des voies:", error);
        this.voies = [];
      }
    },
    async fetchCompetencesDeLaVoie(voieSlug) {
      try {
        const response = await fetch(`http://localhost:3000/api/competences/${voieSlug}`);
        const data = await response.json();
        this.competencesDeLaVoie = Array.isArray(data) ? data : (data.competences || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des compétences:", error);
        this.competencesDeLaVoie = [];
      }
    },
    isCompetenceAdded(competence) {
      return this.existingCompetences.some(c => c.nom === competence.nom);
    },
    selectCompetence(competence) {
      this.selectedCompetence = competence;
      this.selectedType = competence.type || '';
    },
    validateCompetence() {
      if (!this.selectedCompetence || !this.selectedType) return;
      // On clone la compétence et on force le type choisi
      const voieObj = this.voies.find(v => v.slug === this.selectedVoie);
      const competenceToAdd = {
        ...this.selectedCompetence,
        type: this.selectedType,
        voie: voieObj ? voieObj.nom : (this.selectedCompetence.voie || '')
      };
      this.$emit('select', competenceToAdd);
      this.showSelector = false;
      this.selectedVoie = null;
      this.selectedCompetence = null;
      this.selectedType = '';
    },
    cancelTypeSelection() {
      this.selectedCompetence = null;
      this.selectedType = '';
    }
  }
};
</script>

<style scoped>
.competence-selector {
  margin-top: 15px;
}

.add-competence-btn {
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}

.add-competence-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}

.voie-selector,
.competence-list {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.voie-dropdown {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.competences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin: 15px 0;
}

.competence-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.competence-item:hover:not(.disabled) {
  background-color: #f0f0f0;
  border-color: #2c6578;
}

.competence-item.disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  border-color: #ddd;
}

.competence-type {
  display: block;
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}

.cancel-btn,
.back-btn {
  background: #ccc;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  margin-top: 10px;
}

.cancel-btn:hover,
.back-btn:hover {
  background: #999;
}

.type-selection {
  margin-top: 10px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.choose-type-btn {
  margin-top: 8px;
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
}
.choose-type-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}
.validate-btn {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
}
.validate-btn:disabled {
  background: #ccc;
  color: #888;
  cursor: not-allowed;
}
</style> 