<template>
  <div>
    <!-- Titre principal -->
    <h1>Outils</h1>
    <!-- Sous-titre -->
    <p>Voici les différents outils qui pourraient m'être utiles</p>
    <!-- Section compteur -->
    <div class="counter-section">
      <span>Compteur : {{ counter }}</span>
      <button @click="incrementCounter">Incrémenter</button>
      <button v-if="counter > 0" @click="saveCounter">Sauvegarder</button>
      <button @click="resetCounter">Réinitialiser</button>
    </div>
    <!-- Message de sauvegarde du compteur -->
    <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>

    <!-- Séparateur principal -->
    <hr class="divider" />

    <!-- Bouton pour afficher le formulaire d'ajout de personnage -->
    <button @click="showCharacterForm = true" v-if="!showCharacterForm" class="add-character-btn">
      Ajouter un Personnage
    </button>

    <!-- Section contenant le formulaire -->
    <div class="character-section">
      <!-- Formulaire d'ajout / édition de personnage -->
      <div v-if="showCharacterForm" class="character-form">
        <h2>Ajouter un Personnage</h2>
        <form @submit.prevent="saveCharacter">
          <!-- Nom, Race, Classe, Joueur -->
          <div class="form-row">
            <label>Nom : <input type="text" v-model="character.nom" required class="input-small" /></label>
            <label>Race : <input type="text" v-model="character.race" required class="input-small" /></label>
            <label>Classe : <input type="text" v-model="character.classe" required class="input-small" /></label>
            <label>Joueur : <input type="text" v-model="character.joueur" required class="input-small" /></label>
          </div>
          <!-- Expérience -->
          <div class="form-row">
            <label style="flex:1">
              Expérience :
              <input type="number" v-model.number="character.experience" min="0" max="100" required class="input-small" />
            </label>
          </div>
          <!-- Inspiration/Armure/PV/Vitesse/DR -->
          <div class="form-row top-stats-row">
            <label>Inspiration : <input type="number" v-model.number="character.inspiration" min="0" step="1" class="input-small" /></label>
            <label>Armure : <input type="number" v-model.number="character.armure" min="0" class="input-small" /></label>
            <label>PV : <input type="number" v-model.number="character.pv" min="0" class="input-small" /></label>
            <label>Vitesse : <input type="number" v-model.number="character.vitesse" min="0" class="input-small" /></label>
            <label>DR : <input type="text" v-model="character.deRecup" class="input-small" /></label>
          </div>
          <!-- Caracs / Maîtrises / Jets / Inventaire -->
          <div class="form-central big">
            <div class="form-col big">
              <label v-for="carac in caracsList" :key="carac">
                {{ carac }} :
                <input type="number" v-model.number="character.caracs[carac]" step="1" required class="input-small" />
              </label>
            </div>
            <div class="form-col big">
              <div class="maitrises-list big">
                <label v-for="maitrise in maitrisesList" :key="maitrise">
                  {{ maitrise }} :
                  <input type="number" v-model.number="character.maitrises[maitrise]" step="1" class="input-small" />
                </label>
              </div>
            </div>
            <div class="form-col big">
              <div class="jets-section">
                <div>
                  <span>Jets réussis :</span>
                  <input type="checkbox" v-for="i in 3" :key="'r'+i" v-model="character.jetsReussis[i-1]" />
                </div>
                <div>
                  <span>Jets échoués :</span>
                  <input type="checkbox" v-for="i in 3" :key="'e'+i" v-model="character.jetsEchoues[i-1]" />
                </div>
              </div>
              <label>
                Inventaire :
                <textarea v-model="character.inventaire" rows="2" class="input-small"></textarea>
              </label>
            </div>
          </div>
          <!-- Background -->
          <div class="form-row">
            <label style="flex:1">
              Background :
              <textarea v-model="character.background" rows="3" class="input"></textarea>
            </label>
          </div>
          <!-- Image (nouvel input) -->
          <div class="form-row">
            <label style="flex:1">
              Image :
              <input
                type="text"
                v-model="character.image"
                placeholder="Lien vers l'image"
                class="input"
              />
            </label>
          </div>

          <!-- Boutons Annuler / Sauvegarder -->
          <div class="form-actions">
            <button type="button" @click="cancelCharacter">Annuler</button>
            <button type="submit">Sauvegarder</button>
          </div>
        </form>
        <div v-if="characterSaveMessage" class="save-message">{{ characterSaveMessage }}</div>
      </div>
    </div>

    <!-- Divider entre formulaire/bouton et cards -->
    <hr class="divider-between" />

    <!-- Cartes minimalistes (nom, race, classe, joueur) -->
    <div class="character-cards">
      <div 
        v-for="(perso, idx) in characters" 
        :key="idx" 
        class="character-card big"
        @click="openModal(perso)"
      >
        <div class="card-header">
          <div class="card-header-name">{{ perso.nom }}</div>
          <div class="card-header-details">
            <span>Race : {{ perso.race }}</span>
            <span>Classe : {{ perso.classe }}</span>
            <span>Joueur : {{ perso.joueur }}</span>
          </div>
        </div>
        <!-- On ne montre PAS background ni image ici -->

        <!-- Boutons "Modifier" + "Supprimer" -->
        <div class="card-buttons" @click.stop>
          <button class="edit-character-btn" @click="editCharacter(idx)">Modifier</button>
          <button class="delete-character-btn" @click="removeCharacter(idx)">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modale détaillée -->
    <transition name="fade">
      <div v-if="selectedCharacter" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">×</button>
          <div class="modal-header">
            <div class="modal-header-name">{{ selectedCharacter.nom }}</div>
            <div class="modal-header-details">
              <span>Race : {{ selectedCharacter.race }}</span>
              <span>Classe : {{ selectedCharacter.classe }}</span>
              <span>Joueur : {{ selectedCharacter.joueur }}</span>
            </div>
          </div>
          
          <!-- XP + stats -->
          <div class="xp-bar-container">
            <div class="xp-bar" :style="{ width: ((selectedCharacter.experience ?? 0) + '%') }"></div>
            <span class="xp-label">{{ selectedCharacter.experience ?? 0 }}/100 XP</span>
          </div>
          <div class="card-top-stats-row">
            <span><strong>Inspiration :</strong> {{ selectedCharacter.inspiration ?? 0 }}</span>
            <span><strong>Armure :</strong> {{ selectedCharacter.armure ?? 0 }}</span>
            <span><strong>PV :</strong> {{ selectedCharacter.pv ?? 0 }}</span>
            <span><strong>Vitesse :</strong> {{ selectedCharacter.vitesse ?? 0 }}</span>
            <span><strong>DR :</strong> {{ selectedCharacter.deRecup ?? '' }}</span>
          </div>

          <!-- Caracs / Maîtrises / Jets / Inventaire -->
          <div class="card-central big">
            <div class="card-col big">
              <div v-for="(val, carac) in selectedCharacter.caracs" :key="carac">
                <strong>{{ carac }} :</strong> {{ val }}
              </div>
            </div>
            <div class="card-col big">
              <div class="maitrises-list big">
                <div v-for="(val, maitrise) in selectedCharacter.maitrises" :key="maitrise">
                  <strong>{{ maitrise }} :</strong> {{ val }}
                </div>
              </div>
            </div>
            <div class="card-col big">
              <div class="jets-section">
                <div>
                  <span>Jets réussis :</span>
                  <input type="checkbox" v-for="(jet,i) in selectedCharacter.jetsReussis" :key="'r'+i" :checked="jet" disabled />
                </div>
                <div>
                  <span>Jets échoués :</span>
                  <input type="checkbox" v-for="(jet,i) in selectedCharacter.jetsEchoues" :key="'e'+i" :checked="jet" disabled />
                </div>
              </div>
              <div>
                <strong>Inventaire :</strong>
                <div class="card-inventaire">{{ selectedCharacter.inventaire }}</div>
              </div>
            </div>
          </div>

          <!-- Divider AVANT background -->
          <hr class="modal-divider" />
          <!-- Background -->
          <div class="card-background">
            <strong>Background :</strong>
            <div>{{ selectedCharacter.background }}</div>
          </div>
          <!-- Divider APRÈS background -->
          <hr class="modal-divider" />

          <!-- Lien cliquable si présent -->
          <div v-if="selectedCharacter.image" class="card-image" style="margin-top: 10px;">
            <strong>Image :</strong><br />
            <a :href="selectedCharacter.image" target="_blank" class="image-link">
              {{ selectedCharacter.image }}
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Outils',
  data() {
    return {
      counter: 0,
      saveMessage: '',
      showCharacterForm: false,
      // Personnage en cours d'édition
      character: {
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
        pv: 0,
        vitesse: 0,
        deRecup: '',
        jetsReussis: [false, false, false],
        jetsEchoues: [false, false, false],
        inventaire: '',
        background: '',
        image: '' // ← Lien affiché sous forme de texte cliquable
      },
      characterSaveMessage: '',
      characters: [],
      caracsList: ['Force','Dextérité','Constitution','Intelligence','Sagesse','Charisme'],
      maitrisesList: [
        'Acrobaties','Arcanes','Athlétisme','Discrétion','Dressage','Escamotage','Histoire','Intimidation',
        'Investigation','Médecine','Nature','Perception','Persuasion','Religion','Représentation','Survie',
        'Tromperie','Perception passive','Performance','Survie urbaine'
      ],
      editIndex: null,
      selectedCharacter: null
    };
  },
  mounted() {
    const savedCounter = localStorage.getItem('outils-counter');
    if (savedCounter !== null) {
      this.counter = parseInt(savedCounter, 10);
    }
    const savedCharacters = localStorage.getItem('outils-characters');
    if (savedCharacters) {
      this.characters = JSON.parse(savedCharacters);
    }
  },
  methods: {
    incrementCounter() {
      this.counter++;
      localStorage.setItem('outils-counter', this.counter);
    },
    resetCounter() {
      this.counter = 0;
      localStorage.setItem('outils-counter', this.counter);
    },
    async saveCounter() {
      try {
        await axios.post('http://localhost:3000/api/counter', { value: this.counter });
        this.saveMessage = 'Compteur sauvegardé !';
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      } catch (error) {
        this.saveMessage = "Erreur lors de la sauvegarde";
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      }
    },
    cancelCharacter() {
      this.resetCharacterForm();
      this.showCharacterForm = false;
      this.characterSaveMessage = '';
    },
    // Sauvegarde le personnage dans la liste
    saveCharacter() {
      if (this.editIndex !== null) {
        this.characters.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.character)));
        this.editIndex = null;
      } else {
        this.characters.push(JSON.parse(JSON.stringify(this.character)));
      }
      localStorage.setItem('outils-characters', JSON.stringify(this.characters));
      this.characterSaveMessage = 'Les données sont sauvegardées';
      setTimeout(() => {
        this.characterSaveMessage = '';
        this.resetCharacterForm();
        this.showCharacterForm = false;
      }, 1200);
    },
    resetCharacterForm() {
      this.character = {
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
        maitrises: Object.fromEntries(this.maitrisesList.map(m => [m, 0])),
        armure: 0,
        pv: 0,
        vitesse: 0,
        deRecup: '',
        jetsReussis: [false, false, false],
        jetsEchoues: [false, false, false],
        inventaire: '',
        background: '',
        image: ''
      };
    },
    removeCharacter(index) {
      this.characters.splice(index, 1);
      localStorage.setItem('outils-characters', JSON.stringify(this.characters));
    },
    editCharacter(idx) {
      this.editIndex = idx;
      this.character = JSON.parse(JSON.stringify(this.characters[idx]));
      this.showCharacterForm = true;
    },
    openModal(perso) {
      this.selectedCharacter = perso;
    },
    closeModal() {
      this.selectedCharacter = null;
    }
  },
  created() {
    // Initialiser les maîtrises à 0 si pas faites
    if (!this.character.maitrises || Object.keys(this.character.maitrises).length === 0) {
      this.character.maitrises = Object.fromEntries(this.maitrisesList.map(m => [m, 0]));
    }
  }
};
</script>

<style scoped>
/* Aligne le formulaire et la card à gauche */
.character-form,
.character-card.big {
  max-width: 700px;
  min-width: 400px;
  margin-left: 0;    /* Aligne à gauche */
  margin-right: 0;
  margin-bottom: 30px;
}

/* Pour que les dividers de la modale soient visibles comme "divider-between" */
.modal-divider {
  margin: 16px 0;
  border: none;
  border-top: 2px solid #c8aa6e;
  width: 100%;
}

/* Exemple de lien stylé pour l'URL dans la modale */
.image-link {
  color: #2c6578;
  text-decoration: underline;
  word-break: break-word; /* pour éviter le débordement sur une ligne */
}

/* Colonnes du bloc central : même hauteur, même largeur, espace entre les champs */
.form-central.big,
.card-central.big {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  min-height: 50px; /* Ajuste cette valeur selon la hauteur souhaitée */
}

/* Colonnes verticales, même hauteur, espace entre les champs */
.form-col.big,
.card-col.big {
  display: flex;
  flex-direction: column;
  gap: 23px; /* Augmente l'espace entre les champs pour remplir la colonne */
  min-width: 100px;
  max-width: 140px;
  flex: 1 1 0;
  height: 100%;
  justify-content: space-between; /* Répartit les champs sur toute la hauteur */
}

/* Plus d'espace entre les inputs sur une même ligne */
.form-row {
  display: flex;
  gap: 24px; /* Augmente l'espace entre les inputs sur la ligne */
}

/* Réduit la taille des inputs mais garde l'espacement général */
.input-small {
  width: 60px;
  min-width: 40px;
  max-width: 70px;
  padding: 2px 4px;
  font-size: 0.95em;
  box-sizing: border-box;
}

/* Maîtrises en colonne */
.maitrises-list.big {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 220px; /* Ajuste la hauteur selon ta préférence */
  overflow-y: auto;  /* Active le scroll vertical */
}

/* Section formulaire et cards en colonne (cards sous le formulaire) */
.character-section {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start; /* Aligne à gauche */
}

/* Les cards aussi à gauche */
.character-cards {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start; /* Aligne à gauche */
}

/* Divider entre formulaire/bouton et cards */
.divider-between {
  margin: 0px 0 20px 0;
  border: none;
  border-top: 2px solid #c8aa6e;
  width: 100%;
}

/* Le reste de tes styles inchangés */
.content { margin-top: 60px; padding: 20px; }
.counter-section { margin-top: 30px; display: flex; align-items: center; gap: 15px; }
.save-message { margin-top: 15px; color: #2c6578; font-weight: bold; }
.divider { margin: 40px 0 20px 0; border: none; border-top: 2px solid #c8aa6e; }
.add-character-btn { background: #2c6578; color: #fff; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer; font-size: 1em; margin-bottom: 20px; }
.add-character-btn:hover { background: #c8aa6e; color: #2c6578; }
.jets-section { margin: 8px 0; }
.jets-section > div { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center; /* centre horizontalement */
  gap: 6px;
  margin-bottom: 6px;
}
.card-header-name {
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
}
.card-header-details {
  display: flex;
  gap: 12px;
  font-size: 0.95em;
  flex-wrap: wrap;
  justify-content: center;
}
/* Barre d'expérience */
.xp-bar-container { position: relative; height: 14px; background: #eee; border-radius: 8px; margin-bottom: 8px; width: 100%; overflow: hidden; }
.xp-bar { height: 100%; background: linear-gradient(90deg, #c8aa6e 60%, #2c6578 100%); border-radius: 8px 0 0 8px; transition: width 0.4s; }
.xp-label { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: 0.9em; color: #2c6578; font-weight: bold; line-height: 14px; }
/* Boutons Modifier + Supprimer sous la card */
.card-buttons {
  margin-top: 10px;
  gap: 12px;
  display: flex;
  justify-content: center;
}
.edit-character-btn {
  background: #c89a6e;
  color: #fff;
  border: none;
  padding: 7px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.edit-character-btn:hover {
  background: #2c6578;
}
/* Background des cards */
.card-background {
  padding: 2px 0px;
  margin-top: 2px;
  font-size: 0.95em;
}
.card-inventaire {
  padding: 2px 0px;
  margin-top: 2px;
  font-size: 0.95em;
}

/* Ligne Inspiration/Armure/PV/Vitesse/DR */
.top-stats-row,
.card-top-stats-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-bottom: 18px;
  margin-top: 8px;
  align-items: center;
}
.top-stats-row label,
.card-top-stats-row span {
  font-weight: bold;
  font-size: 1em;
}

/* Retire la marge en bas du bloc central pour coller le background */
.card-central.big {
  margin-bottom: 0;
}

/* Exemple simple de transition "fade" pour la modale */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Overlay + contenu de la modale */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}
/* Bouton de fermeture dans la modale */
.close-btn {
  position: absolute;
  top: 8px; right: 12px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

/* Bouton "Supprimer" pour la Card */
.delete-character-btn {
  background: #c65757;
  color: #fff;
  border: none;
  padding: 7px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-character-btn:hover {
  background: #8f4040;
}

/* Nom + Race/Classe/Joueur centrés dans la modale */
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}
.modal-header-name {
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
}
.modal-header-details {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>