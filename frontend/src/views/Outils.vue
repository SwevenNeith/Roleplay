<template>
  <div>
    <!-- Titre principal -->
    <h1>Outils</h1>
    <!-- Sous-titre -->
    <p>Voici les différents outils qui pourraient m'être utiles</p>
    <!-- Section compteur -->
    <div class="counter-section">
      <span>Compteur : {{ counter }}</span>
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

          <!-- Bouton Ajouter une compétence -->
          <button type="button" @click="showCompetenceForm = true" class="add-competence-btn">
            Ajouter une compétence
          </button>

          <!-- Liste des compétences ajoutées -->
          <div v-if="character.competences.length > 0" class="competences-list">
            <h3>Compétences :</h3>
            <ul>
              <li v-for="(competence, idx) in character.competences" :key="idx">
                {{ competence.nom }} ({{ competence.type }})
                <button @click="removeCompetence(idx)" class="delete-competence-btn">Supprimer</button>
              </li>
            </ul>
          </div>

          <!-- Formulaire pour ajouter une compétence -->
          <div v-if="showCompetenceForm" class="competence-form">
            <h3>Ajouter une Compétence</h3>
            <label>
              Nom de la compétence :
              <input type="text" v-model="newCompetence.nom" required />
            </label>
            <label>
              Nom de la voie :
              <input type="text" v-model="newCompetence.voie" required />
            </label>
            <div>
              <label>
                <input type="radio" value="Attaque" v-model="newCompetence.type" /> Attaque
              </label>
              <label>
                <input type="radio" value="Soin" v-model="newCompetence.type" /> Soin
              </label>
              <label>
                <input type="radio" value="Défense" v-model="newCompetence.type" /> Défense
              </label>
            </div>
            <button @click="addCompetence" class="add-competence-btn">Ajouter</button>
            <button @click="cancelCompetence" class="cancel-competence-btn">Annuler</button>
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

          <!-- Liste des compétences -->
          <div v-if="selectedCharacter.competences && selectedCharacter.competences.length > 0" class="card-competences">
            <h3>Compétences :</h3>
            <div class="competences-grid">
              <div v-for="(competence, idx) in selectedCharacter.competences" :key="idx" class="competence-item">
                <strong>{{ competence.nom }}</strong><br />
                <span>Voie : {{ competence.voie }}</span><br />
                <span>Type : {{ competence.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Divider entre Cards et le bouton de combat -->
    <hr class="divider-between" />

    <!-- Bouton "Commencer un combat" -->
    <button 
      v-if="!showCombatList && !showInitiativePhase && !showCombatPhase" 
      @click="showCombatList = true" 
      class="combat-btn"
    >
      Commencer un combat
    </button>

    <!-- Message de confirmation sous le bouton -->
    <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>

    <!-- Liste déroulante des personnages si showCombatList = true -->
    <div v-if="showCombatList" class="combat-section">
      <h2>Participants Potentiels</h2>
      <div class="combat-characters">
        <div
          v-for="(perso, idx) in characters"
          :key="'combat'+idx"
          :class="['combat-character-item', { selected: selectedCombatCharacters.includes(perso._id) }]"
          @click="toggleCombatSelection(perso._id)"
        >
          <strong>{{ perso.nom }}</strong><br />
          <span>Race: {{ perso.race }}</span> |
          <span>Classe: {{ perso.classe }}</span> |
          <span>Joueur: {{ perso.joueur }}</span>
        </div>
      </div>

      <!-- Bouton Annuler -->
      <button @click="cancelCombatList" class="cancel-combat-btn">
        Annuler
      </button>

      <!-- Bouton Lancer l'initiative -->
      <button 
        v-if="selectedCombatCharacters.length > 0" 
        @click="startInitiativePhase" 
        class="initiative-btn"
      >
        Lancer l'initiative
      </button>
    </div>

    <!-- Phase d'initiative -->
    <div v-if="showInitiativePhase" class="initiative-section">
      <h2>Phase d'Initiative</h2>
      <div class="initiative-characters">
        <div
          v-for="(perso, idx) in selectedCombatParticipants"
          :key="'initiative'+idx"
          class="initiative-character-item"
        >
          <strong>{{ perso.nom }}</strong>
          <input 
            type="number" 
            v-model.number="perso.initiative" 
            placeholder="Initiative" 
            class="initiative-input"
            :max="30"
          />
          <!-- Limite la valeur d'initiative à 30 -->
        </div>
      </div>

      <!-- Boutons Annuler / Démarrer le combat -->
      <div class="initiative-actions">
        <button @click="cancelInitiativePhase" class="cancel-combat-btn">
          Annuler
        </button>
        <button @click="startCombatPhase" class="start-combat-btn">
          Démarrer le combat
        </button>
      </div>
    </div>

    <!-- Phase de combat -->
    <div v-if="showCombatPhase" class="combat-phase">
      <h2>Phase de Combat</h2>
      <div class="combat-participants">
        <div
          v-for="(perso, idx) in sortedCombatParticipants"
          :key="'combatPhase'+idx"
          :class="['combat-participant-item', { selected: idx === selectedParticipantIndex }]"
        >
          <!-- Nom, Initiative et PV -->
          <strong>{{ perso.nom }}</strong> - Initiative : {{ perso.initiative }} - PV : {{ perso.pv }}

          <!-- Bouton "Fin du round" visible uniquement pour le participant sélectionné -->
          <button
            v-if="idx === selectedParticipantIndex"
            @click="endRound"
            class="end-round-btn"
          >
            Fin du round
          </button>
        </div>
      </div>

      <!-- Compétences du personnage sélectionné -->
      <div v-if="sortedCombatParticipants[selectedParticipantIndex]" class="combat-competences">
        <h4>Compétences de {{ sortedCombatParticipants[selectedParticipantIndex].nom }} :</h4>
        <ul>
          <li
            v-for="(competence, cIdx) in sortedCombatParticipants[selectedParticipantIndex].competences"
            :key="'competence'+cIdx"
            :class="['competence-item', { selected: isCompetenceSelected(competence), cooldown: isCompetenceOnCooldown(competence) }]"
            @click="selectCompetence(competence)"
          >
            <span>{{ competence.nom }} ({{ competence.type }})</span>
            <span v-if="isCompetenceOnCooldown(competence)" class="cooldown-text">
              Utilisable dans {{ competence.cooldownEnd - counter }} tour(s)
            </span>
          </li>
        </ul>
      </div>

      <!-- Bouton "Fin du combat" -->
      <button @click="endCombat" class="cancel-combat-btn">
        Fin du combat
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Outils',
  data() {
    return {
      counter: 1, // Le compteur commence maintenant à 1
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
        image: '', // ← Lien affiché sous forme de texte cliquable
        competences: [] // Ajout du tableau de compétences
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
      selectedCharacter: null,
      showCombatList: false,
      selectedCombatCharacters: [],
      selectedCombatParticipants: [],
      showInitiativePhase: false,
      showCombatPhase: false,
      selectedParticipantIndex: 0, // Index du participant actuellement sélectionné

      // Nouveaux champs pour la compétence
      newCompetence: {
        nom: '',
        voie: '',
        type: ''
      },
      showCompetenceForm: false, // Contrôle l'affichage du formulaire de compétence

      // Pour la sélection des compétences
      selectedCompetences: [] // Nouvelle propriété pour suivre les compétences sélectionnées
    };
  },
  mounted() {
    // Conservez uniquement la récupération des personnages depuis MongoDB
    this.getAllCharacters();
  },
  computed: {
    // Trie les participants par ordre décroissant d'initiative
    sortedCombatParticipants() {
      return [...this.selectedCombatParticipants].sort((a, b) => b.initiative - a.initiative);
    }
  },
  methods: {
    cancelCharacter() {
      this.resetCharacterForm();
      this.showCharacterForm = false;
      this.characterSaveMessage = '';
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
          Charisme: 0
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
        image: '',
        competences: [] // Réinitialise aussi le tableau de compétences
      };
    },
    // Sauvegarde le personnage dans la liste
    async saveCharacter() {
      try {
        if (this.editIndex !== null) {
          const charId = this.characters[this.editIndex]._id;
          await axios.put(`http://localhost:3000/api/characters/${charId}`, this.character);
          this.editIndex = null;
        } else {
          // Sauvegarde le personnage dans MongoDB
          const response = await axios.post('http://localhost:3000/api/characters', this.character);

          // Récupère l'ID du personnage créé
          const characterId = response.data._id;

          // Sauvegarde les compétences associées dans MongoDB
          for (const competence of this.character.competences) {
            competence.characterId = characterId; // Associe l'ID du personnage à la compétence
            await axios.post('http://localhost:3000/api/competences', competence);
          }
        }

        await this.getAllCharacters();
        this.characterSaveMessage = 'Les données sont sauvegardées';
        setTimeout(() => {
          this.characterSaveMessage = '';
          this.resetCharacterForm();
          this.showCharacterForm = false;
        }, 1200);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du personnage :", error);
      }
    },
    async getAllCharacters() {
      try {
        const response = await axios.get('http://localhost:3000/api/characters');
        this.characters = response.data;
      } catch (error) {
        console.error("Erreur lors du getAllCharacters:", error);
      }
    },
    async removeCharacter(index) {
      try {
        const charId = this.characters[index]._id;
        // DELETE pour supprimer en base
        await axios.delete(`http://localhost:3000/api/characters/${charId}`);
        // Ensuite, recharger la liste
        await this.getAllCharacters();
      } catch (error) {
        console.error("Erreur lors de la suppression du personnage:", error);
      }
    },
    editCharacter(idx) {
      // On mémorise l'indice pour savoir quel personnage éditer
      this.editIndex = idx;
      this.character = JSON.parse(JSON.stringify(this.characters[idx]));
      this.showCharacterForm = true;
    },
    openModal(perso) {
      this.selectedCharacter = perso;
    },
    closeModal() {
      this.selectedCharacter = null;
    },
    toggleCombatSelection(charId) {
      if (this.selectedCombatCharacters.includes(charId)) {
        this.selectedCombatCharacters = this.selectedCombatCharacters.filter(id => id !== charId);
      } else {
        this.selectedCombatCharacters.push(charId);
      }
    },
    cancelCombatList() {
      this.showCombatList = false;
      this.selectedCombatCharacters = [];
    },
    startInitiativePhase() {
      this.showCombatList = false;
      this.showInitiativePhase = true;
      // Prépare les participants sélectionnés avec un champ "initiative"
      this.selectedCombatParticipants = this.characters
        .filter(perso => this.selectedCombatCharacters.includes(perso._id))
        .map(perso => ({ ...perso, initiative: 0 }));
    },
    cancelInitiativePhase() {
      this.showInitiativePhase = false;
      this.showCombatList = true;
    },
    startCombatPhase() {
      this.showInitiativePhase = false;
      this.showCombatPhase = true;

      // Limite les initiatives à 30
      this.selectedCombatParticipants.forEach(perso => {
        if (perso.initiative > 30) {
          perso.initiative = 30;
        }
      });

      // Sélectionne automatiquement le premier participant (plus haute initiative)
      this.selectedParticipantIndex = 0;
    },
    // Vérifie si une compétence est sélectionnée
    isCompetenceSelected(competence) {
      return this.selectedCompetences.length > 0 && this.selectedCompetences[0].nom === competence.nom;
    },

    // Vérifie si une compétence est en cooldown
    isCompetenceOnCooldown(competence) {
      return competence.cooldownEnd && competence.cooldownEnd > this.counter;
    },

    // Sélectionne une compétence (une seule à la fois)
    selectCompetence(competence) {
      if (this.isCompetenceOnCooldown(competence)) {
        alert(`Cette compétence est en cooldown ! Utilisable dans ${competence.cooldownEnd - this.counter} tour(s).`);
        return;
      }

      if (this.selectedCompetences.length > 0 && this.selectedCompetences[0].nom === competence.nom) {
        // Si la compétence est déjà sélectionnée, on la désélectionne
        this.selectedCompetences = [];
      } else {
        // Sinon, on sélectionne uniquement cette compétence
        this.selectedCompetences = [competence];
        competence.cooldownEnd = this.counter + 3; // Cooldown de 2 tours complets (réutilisable au tour actuel + 3)
      }
    },

    // Passe au tour suivant et réduit le cooldown des compétences
    endRound() {
      // Passe au participant suivant
      this.selectedParticipantIndex++;
      if (this.selectedParticipantIndex >= this.sortedCombatParticipants.length) {
        // Si on dépasse le dernier participant, revient au premier
        this.selectedParticipantIndex = 0;
        // Incrémente le compteur à chaque retour au premier participant
        this.counter++;
      }
    },
    async saveCombatData() {
      try {
        // Prépare les données à envoyer
        const combatData = {
          participants: this.sortedCombatParticipants.map(perso => ({
            nom: perso.nom,
            initiative: perso.initiative
          })),
          date: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
          tours: this.counter // Nombre de tours
        };

        // Envoie les données au backend
        await axios.post('http://localhost:3000/api/combats', combatData);

        // Affiche un message de confirmation
        this.saveMessage = 'Les données du combat sont envoyées';
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      } catch (error) {
        console.error("Erreur lors de l'envoi des données du combat :", error);
        this.saveMessage = "Erreur lors de l'envoi des données";
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      }
    },
    endCombat() {
      // Envoie les données du combat avant de réinitialiser
      this.saveCombatData();

      // Réinitialise la phase de combat
      this.showCombatPhase = false;
      this.showCombatList = false;
      this.selectedCombatCharacters = [];
      this.selectedCombatParticipants = [];
      this.selectedParticipantIndex = 0;

      // Réinitialise le compteur à 1
      this.counter = 1;
    },
    // Fonction utilitaire pour créer un slug
    slugify(str) {
      return str
        .toLowerCase()
        .normalize('NFD') // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques (accents)
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/[^\w-]+/g, ''); // Supprime les caractères non alphanumériques
    },

    // Ajouter une compétence au personnage
    async addCompetence() {
      if (!this.newCompetence.nom || !this.newCompetence.voie || !this.newCompetence.type) {
        alert("Veuillez remplir tous les champs pour la compétence.");
        return;
      }

      const competence = {
        nom: this.newCompetence.nom,
        voie: this.newCompetence.voie,
        type: this.newCompetence.type,
        slug: this.slugify(this.newCompetence.nom),
        voie_slug: this.slugify(this.newCompetence.voie)
      };

      // Ajoute la compétence à la liste locale du personnage
      this.character.competences.push(competence);

      // Réinitialise le formulaire de compétence
      this.newCompetence = { nom: '', voie: '', type: '' };
      this.showCompetenceForm = false; // Ferme uniquement le formulaire de compétence
    },

    // Annuler l'ajout d'une compétence
    cancelCompetence() {
      this.newCompetence = { nom: '', voie: '', type: '' };
      this.showCompetenceForm = false;
    },

    // Supprimer une compétence du personnage
    removeCompetence(index) {
      // Supprime la compétence de la liste locale du personnage
      this.character.competences.splice(index, 1);
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

/* Bouton Commencer un combat */
.combat-btn {
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 20px;
}
.combat-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}
/* Section combat */
.combat-section {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  width: 100%;
  max-width: 700px;
}
/* Liste des personnages pour le combat */
.combat-characters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.combat-character-item {
  padding: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.combat-character-item.selected {
  background-color: #c8aa6e;
  color: #fff;
  font-weight: bold;
}

/* Bouton Annuler dans la section combat */
.cancel-combat-btn {
  margin-top: 15px;
  background: #ccc;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.cancel-combat-btn:hover {
  background: #999;
}

/* Boutons dans la phase d'initiative */
.initiative-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Aligne les boutons à gauche */
}

/* Phase de combat */
.combat-phase {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  width: 100%;
  max-width: 700px;
}
.combat-participants {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.combat-participant-item {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.combat-participant-item.selected {
  background-color: #c8aa6e;
  color: #fff;
  font-weight: bold;
}

/* Bouton "Fin du round" */
.end-round-btn {
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}
.end-round-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
  border: 1px solid #2c6578;
}

/* Bouton "Fin du combat" */
.cancel-combat-btn {
  margin-top: 15px;
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}
.cancel-combat-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}

/* Style commun pour tous les boutons */
button {
  background: #2c6578;
  color: #fff;
  border: none;
  padding: 10px 18px; /* Ajuste le padding pour un rendu uniforme */
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 10px;
  transition: background 0.3s, color 0.3s;
  display: inline-block; /* Permet aux boutons de s'adapter à leur contenu */
  text-align: center; /* Centre le texte */
}

button:hover {
  background: #c8aa6e;
  color: #2c6578;
}

/* Boutons spécifiques (héritent du style commun) */
.combat-btn,
.cancel-combat-btn,
.initiative-btn,
.start-combat-btn,
.add-character-btn {
  /* Héritent du style commun */
}

.competence-form {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.combat-competences h4 {
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.combat-competences ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.combat-competences li {
  display: flex;
  justify-content: space-between; /* Aligne le texte à gauche et le cooldown à droite */
  align-items: center;
  font-size: 0.9em;
  margin-bottom: 5px;
  cursor: pointer;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
}

.combat-competences li.cooldown {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
  border-color: #ccc;
}

.cooldown-text {
  font-size: 0.85em;
  color: #999;
  font-style: italic;
}
</style>