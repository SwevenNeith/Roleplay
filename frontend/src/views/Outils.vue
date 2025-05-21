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
      <!-- Formulaire d'ajout de personnage -->
      <div v-if="showCharacterForm" class="character-form">
        <h2>Ajouter un Personnage</h2>
        <form @submit.prevent="saveCharacter">
          <!-- Ligne 1 : Informations principales -->
          <div class="form-row">
            <label>Nom : <input type="text" v-model="character.nom" required class="input-small" /></label>
            <label>Race : <input type="text" v-model="character.race" required class="input-small" /></label>
            <label>Classe : <input type="text" v-model="character.classe" required class="input-small" /></label>
            <label>Joueur : <input type="text" v-model="character.joueur" required class="input-small" /></label>
          </div>
          <!-- Ligne 2 : Expérience -->
          <div class="form-row">
            <label style="flex:1">
              Expérience :
              <input type="number" v-model.number="character.experience" min="0" max="100" required class="input-small" />
            </label>
          </div>
          <!-- Ligne Inspiration/Armure/PV/Vitesse/DR -->
          <div class="form-row top-stats-row">
            <label>Inspiration : <input type="number" v-model.number="character.inspiration" min="0" step="1" required class="input-small" /></label>
            <label>Armure : <input type="number" v-model.number="character.armure" min="0" required class="input-small" /></label>
            <label>PV : <input type="number" v-model.number="character.pv" min="0" required class="input-small" /></label>
            <label>Vitesse : <input type="number" v-model.number="character.vitesse" min="0" required class="input-small" /></label>
            <label>DR : <input type="text" v-model="character.deRecup" required class="input-small" /></label>
          </div>
          <!-- Bloc central : 3 colonnes alignées -->
          <div class="form-central big">
            <!-- Colonne 1 : Caractéristiques -->
            <div class="form-col big">
              <label v-for="carac in caracsList" :key="carac">
                {{ carac }} :
                <input type="number" v-model.number="character.caracs[carac]" step="1" required class="input-small" />
              </label>
            </div>
            <!-- Colonne 2 : Maîtrises -->
            <div class="form-col big">
              <div class="maitrises-list big">
                <label v-for="maitrise in maitrisesList" :key="maitrise">
                  {{ maitrise }} :
                  <input type="number" v-model.number="character.maitrises[maitrise]" step="1" required class="input-small" />
                </label>
              </div>
            </div>
            <!-- Colonne 3 : Jets + Inventaire -->
            <div class="form-col big">
              <div class="jets-section">
                <div>
                  <span>Jets de sauvegarde réussis :</span>
                  <input type="checkbox" v-for="i in 3" :key="'r'+i" v-model="character.jetsReussis[i-1]" />
                </div>
                <div>
                  <span>Jets de sauvegarde échoués :</span>
                  <input type="checkbox" v-for="i in 3" :key="'e'+i" v-model="character.jetsEchoues[i-1]" />
                </div>
              </div>
              <label>
                Inventaire :
                <textarea v-model="character.inventaire" rows="2" required class="input-small"></textarea>
              </label>
            </div>
          </div>
          <!-- Ligne 3 : Background -->
          <div class="form-row">
            <label style="flex:1">
              Background :
              <textarea v-model="character.background" rows="3" required class="input-small"></textarea>
            </label>
          </div>
          <!-- Boutons d'action -->
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

    <!-- Affichage des personnages en Card (SOUS le formulaire) -->
    <div class="character-cards">
      <div v-for="(perso, idx) in characters" :key="idx" class="character-card big">
        <!-- Ligne 1 : infos principales -->
        <div class="card-header">
          <span><strong>{{ perso.nom }}</strong></span>
          <span>Race : {{ perso.race }}</span>
          <span>Classe : {{ perso.classe }}</span>
          <span>Joueur : {{ perso.joueur }}</span>
        </div>
        <!-- Barre d'expérience -->
        <div class="xp-bar-container">
          <div class="xp-bar" :style="{ width: ((perso.experience ?? 0) + '%') }"></div>
          <span class="xp-label">{{ perso.experience ?? 0 }}/100 XP</span>
        </div>
        <!-- Ligne Inspiration/Armure/PV/Vitesse/DR -->
        <div class="card-top-stats-row">
          <span><strong>Inspiration :</strong> {{ perso.inspiration ?? 0 }}</span>
          <span><strong>Armure :</strong> {{ perso.armure ?? 0 }}</span>
          <span><strong>PV :</strong> {{ perso.pv ?? 0 }}</span>
          <span><strong>Vitesse :</strong> {{ perso.vitesse ?? 0 }}</span>
          <span><strong>DR :</strong> {{ perso.deRecup ?? '' }}</span>
        </div>
        <!-- Bloc central : 3 colonnes alignées -->
        <div class="card-central big">
          <!-- Colonne 1 : Caractéristiques -->
          <div class="card-col big">
            <div v-for="carac in caracsList" :key="carac">
              <strong>{{ carac }} :</strong> {{ (perso.caracs && perso.caracs[carac] != null) ? perso.caracs[carac] : 0 }}
            </div>
          </div>
          <!-- Colonne 2 : Maîtrises -->
          <div class="card-col big">
            <div class="maitrises-list big">
              <div v-for="maitrise in maitrisesList" :key="maitrise">
                <strong>{{ maitrise }} :</strong> {{ (perso.maitrises && perso.maitrises[maitrise] != null) ? perso.maitrises[maitrise] : 0 }}
              </div>
            </div>
          </div>
          <!-- Colonne 3 : Jets + Inventaire -->
          <div class="card-col big">
            <div class="jets-section">
              <div>
                <span>Jets réussis :</span>
                <input type="checkbox" v-for="i in 3" :key="'rc'+i" :checked="perso.jetsReussis ? perso.jetsReussis[i-1] : false" disabled />
              </div>
              <div>
                <span>Jets échoués :</span>
                <input type="checkbox" v-for="i in 3" :key="'ec'+i" :checked="perso.jetsEchoues ? perso.jetsEchoues[i-1] : false" disabled />
              </div>
            </div>
            <div>
              <strong>Inventaire :</strong>
              <div class="card-inventaire">{{ perso.inventaire ?? '' }}</div>
            </div>
          </div>
        </div>
        <!-- Background -->
        <div class="card-background">
          <strong>Background :</strong>
          <div>{{ perso.background ?? '' }}</div>
        </div>
        <!-- Juste après le background, sous chaque card -->
        <button class="delete-character-btn" @click="removeCharacter(idx)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Outils',
  data() {
    return {
      // Compteur pour la partie outils
      counter: 0,
      saveMessage: '',
      // Affichage du formulaire
      showCharacterForm: false,
      // Modèle du personnage en cours de création
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
      },
      characterSaveMessage: '',
      // Liste des personnages sauvegardés
      characters: [],
      // Liste des caractéristiques
      caracsList: ['Force', 'Dextérité', 'Constitution', 'Intelligence', 'Sagesse', 'Charisme'],
      // Liste des maîtrises (modifiable)
      maitrisesList: [
        'Acrobaties', 'Arcanes', 'Athlétisme', 'Discrétion', 'Dressage', 'Escamotage', 'Histoire', 'Intimidation',
        'Investigation', 'Médecine', 'Nature', 'Perception', 'Persuasion', 'Religion', 'Représentation', 'Survie',
        'Tromperie', 'Perception passive', 'Performance', 'Survie urbaine'
      ],
    };
  },
  mounted() {
    // Charger le compteur depuis le localStorage
    const savedCounter = localStorage.getItem('outils-counter');
    if (savedCounter !== null) {
      this.counter = parseInt(savedCounter, 10);
    }
    // Charger les personnages depuis le localStorage
    const savedCharacters = localStorage.getItem('outils-characters');
    if (savedCharacters) {
      this.characters = JSON.parse(savedCharacters);
    }
  },
  methods: {
    // Incrémente le compteur
    incrementCounter() {
      this.counter += 1;
      localStorage.setItem('outils-counter', this.counter);
    },
    // Réinitialise le compteur
    resetCounter() {
      this.counter = 0;
      localStorage.setItem('outils-counter', this.counter);
    },
    // Sauvegarde le compteur (exemple avec API)
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
    // Annule la création d'un personnage
    cancelCharacter() {
      this.resetCharacterForm();
      this.showCharacterForm = false;
      this.characterSaveMessage = '';
    },
    // Sauvegarde le personnage dans le localStorage et l'affiche en card
    saveCharacter() {
      // Ajoute le personnage à la liste
      this.characters.push(JSON.parse(JSON.stringify(this.character)));
      // Sauvegarde la liste dans le localStorage
      localStorage.setItem('outils-characters', JSON.stringify(this.characters));
      this.characterSaveMessage = 'Les données sont sauvegardées';
      // Réinitialise le formulaire et ferme le form après un court délai
      setTimeout(() => {
        this.characterSaveMessage = '';
        this.resetCharacterForm();
        this.showCharacterForm = false;
      }, 1200);
    },
    // Réinitialise le formulaire personnage
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
      };
    },
    // Supprime un personnage de la liste
    removeCharacter(index) {
      this.characters.splice(index, 1);
      localStorage.setItem('outils-characters', JSON.stringify(this.characters));
    },
  },
  created() {
    // Initialiser les maîtrises à 0 si ce n'est pas déjà fait
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

/* Colonnes du bloc central : même hauteur, même largeur, espace entre les champs */
.form-central.big,
.card-central.big {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: stretch; /* Les colonnes prennent la même hauteur */
  justify-content: flex-start;
  min-height: 50px; /* Ajuste cette valeur selon la hauteur souhaitée */
}

/* Colonnes verticales, même hauteur, espace entre les champs */
.form-col.big,
.card-col.big {
  display: flex;
  flex-direction: column;
  gap: 32px; /* Augmente l'espace entre les champs pour remplir la colonne */
  min-width: 120px;
  max-width: 140px;
  flex: 1 1 0;
  height: 100%;
  justify-content: space-between; /* Répartit les champs sur toute la hauteur */
}

/* Plus d'espace entre les inputs sur une même ligne */
.form-row {
  display: flex;
  gap: 24px; /* Augmente l'espace entre les inputs sur la ligne */
  margin-bottom: 8px;
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

/* Maîtrises en colonne, pas de scroll */
.maitrises-list.big {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: none;
  overflow: visible;
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
.card-header { display: flex; gap: 12px; font-size: 1.05em; font-weight: bold; margin-bottom: 6px; }
.xp-bar-container { position: relative; height: 14px; background: #eee; border-radius: 8px; margin-bottom: 8px; width: 100%; overflow: hidden; }
.xp-bar { height: 100%; background: linear-gradient(90deg, #c8aa6e 60%, #2c6578 100%); border-radius: 8px 0 0 8px; transition: width 0.4s; }
.xp-label { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: 0.9em; color: #2c6578; font-weight: bold; line-height: 14px; }
.card-background {
  padding: 6px 8px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
  font-size: 0.97em;
}
.card-inventaire { background: #f4f4f4; border: 1px solid #bbb; border-radius: 4px; padding: 2px 6px; margin-top: 2px; font-size: 0.95em; }

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
</style>