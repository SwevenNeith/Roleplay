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
        <CharacterForm
          :initial-data="character"
          submit-button-text="Ajouter"
          @submit="saveCharacter"
          @cancel="cancelCharacter"
        />
      </div>
    </div>

    <!-- Divider entre formulaire/bouton et cards -->
    <hr class="divider-between" />

    <!-- Cartes de personnages -->
    <div class="character-cards">
      <CharacterCard
        v-for="(perso, idx) in characters"
        :key="perso._id"
        :character="perso"
        @delete="removeCharacter(idx)"
        @view="openModal(perso)"
        @update="updateCharacter"
      />
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
            <span><strong>PV :</strong> {{ selectedCharacter.pv[0] ?? 0 }} / {{ selectedCharacter.pv[1] ?? 0 }}</span>
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
          <strong>{{ perso.nom }}</strong> - Initiative : {{ perso.initiative }} - PV : {{ perso.pv[0] ?? 0 }} / {{ perso.pv[1] ?? 0 }}

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

    <!-- Modale pour sélectionner la cible -->
    <transition name="fade">
      <div v-if="showTargetModal" class="modal-overlay" @click.self="cancelTargetSelection">
        <div class="modal-content">
          <h3>Sélectionner la cible</h3>
          <ul class="target-list">
            <li
              v-for="(participant, idx) in sortedCombatParticipants"
              :key="'target'+idx"
              :class="['target-item', { selected: selectedTarget === participant }]"
              @click="selectedTarget = participant"
            >
              {{ participant.nom }}
            </li>
          </ul>
          <div class="modal-actions">
            <button @click="cancelTargetSelection" class="cancel-btn">Annuler</button>
            <button @click="confirmTargetSelection" class="confirm-btn">Confirmer</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modale pour vérifier si la compétence est réussie -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="modal-overlay" @click.self="cancelSuccessCheck">
        <div class="modal-content">
          <h3>La compétence est-elle réussie ?</h3>
          <div class="radio-group">
            <label>
              <input type="radio" value="Oui" v-model="competenceSuccess" /> Oui
            </label>
            <label>
              <input type="radio" value="Non" v-model="competenceSuccess" /> Non
            </label>
          </div>
          <div class="modal-actions">
            <button @click="cancelSuccessCheck" class="cancel-btn">Annuler</button>
            <button @click="confirmSuccessCheck" class="confirm-btn">Confirmer</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modale pour entrer les dégâts -->
    <transition name="fade">
      <div v-if="showDamageModal" class="modal-overlay" @click.self="cancelDamageInput">
        <div class="modal-content">
          <h3>Entrez les dégâts</h3>
          <input type="number" v-model.number="damageValue" min="0" placeholder="Dégâts" class="damage-input" />
          <div class="modal-actions">
            <button @click="cancelDamageInput" class="cancel-btn">Annuler</button>
            <button @click="applyCompetenceEffect" class="confirm-btn">Appliquer</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import CharacterCard from '@/components/CharacterCard.vue';
import CharacterForm from '@/components/CharacterForm.vue';

export default {
  name: 'Outils',
  components: {
    CharacterCard,
    CharacterForm
  },
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
        pv: [0, 0], // Initialisation correcte comme tableau
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
      selectedCompetences: [], // Nouvelle propriété pour suivre les compétences sélectionnées

      // Contrôle l'affichage de la modale
      showTargetModal: false, // Modale pour sélectionner la cible
      showSuccessModal: false, // Modale pour vérifier si la compétence est réussie
      showDamageModal: false, // Modale pour entrer les dégâts
      // Stocke la cible sélectionnée
      selectedTarget: null,
      // Permet de sauvegarder temporairement la compétence sélectionnée
      selectedCompetenceBackup: null,
      // Résultat de la compétence (Oui/Non)
      competenceSuccess: null,
      // Valeur des dégâts
      damageValue: null,
      editIndex: null, // Index du personnage en cours d'édition

      // Stocke les actions effectuées pendant le combat
      combatLog: [],
      
      // Message d'erreur pour les compétences
      competenceError: '',
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
          Charisme: 0,
        },
        inspiration: 0,
        maitrises: Object.fromEntries(this.maitrisesList.map(m => [m, 0])),
        armure: 0,
        pv: [0, 0], // Initialisation correcte comme tableau
        vitesse: 0,
        deRecup: '',
        jetsReussis: [false, false, false],
        jetsEchoues: [false, false, false],
        inventaire: '',
        background: '',
        image: '',
        competences: []
      };
    },
    // Sauvegarde le personnage dans la liste
    async saveCharacter(formData) {
      try {
        // Si les PV actuels ne sont pas définis, les définir à la valeur des PV max
        if (!formData.pv[0]) {
          formData.pv[0] = formData.pv[1];
        }

        if (this.editIndex !== null && this.characters[this.editIndex]?._id) {
          // Si un personnage est en cours d'édition, mettez-le à jour
          const charId = this.characters[this.editIndex]._id;
          await axios.put(`http://localhost:3000/api/characters/${charId}`, formData);
          this.editIndex = null;
        } else {
          // Sinon, créez un nouveau personnage
          const response = await axios.post('http://localhost:3000/api/characters', formData);

          // Récupère l'ID du personnage créé
          const characterId = response.data._id;

          // Sauvegarde les compétences associées dans MongoDB
          for (const competence of formData.competences) {
            competence.characterId = characterId; // Associe l'ID du personnage à la compétence
            await axios.post('http://localhost:3000/api/competences', competence);
          }
        }

        // Rechargez la liste des personnages
        await this.getAllCharacters();

        // Affiche un message de confirmation
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
    async updateCharacter(updatedCharacter) {
      try {
        // Met à jour la liste des personnages
        const index = this.characters.findIndex(char => char._id === updatedCharacter._id);
        if (index !== -1) {
          this.characters[index] = updatedCharacter;
        }
        // Rafraîchit la liste des personnages depuis le serveur
        await this.getAllCharacters();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du personnage:", error);
      }
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
        perso.defenseValue = 0; // Initialise la valeur de défense temporaire
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

      // Réinitialise la cible sélectionnée
      this.selectedTarget = null;

      // Sauvegarde temporairement la compétence sélectionnée
      this.selectedCompetenceBackup = competence;

      // Ouvre la modale pour sélectionner une cible
      this.showTargetModal = true;
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

      // Réinitialise la cible sélectionnée
      this.selectedTarget = null;
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
    async endCombat() {
      try {
        // Prépare les données du combat
        const combatData = {
          date: new Date().toISOString().split('T')[0], // Date du combat
          participants: this.sortedCombatParticipants.map(perso => ({
            nom: perso.nom,
            initiative: perso.initiative,
            pvDebut: [...perso.pv] // PV au début du combat
          })),
          tours: this.combatLog, // Log des tours et des actions
          pvFinaux: this.sortedCombatParticipants.map(perso => ({
            nom: perso.nom,
            pvFin: [perso.pv[0], perso.pv[1]] // Derniers PV actuels et PV max
          })),
          nombreTours: this.counter // Nombre total de tours
        };

        // Envoie les données du combat au backend
        await axios.post('http://localhost:3000/api/combats', combatData);

        // Réinitialise la phase de combat
        this.showCombatPhase = false;
        this.showCombatList = false;
        this.selectedCombatCharacters = [];
        this.selectedCombatParticipants = [];
        this.selectedParticipantIndex = 0;
        this.counter = 1;
        this.combatLog = []; // Réinitialise le log du combat

        alert("Combat terminé et sauvegardé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du combat :", error);
        alert("Erreur lors de la sauvegarde du combat.");
      }
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

      try {
        // Vérifie si la compétence existe déjà dans MongoDB
        const response = await axios.get('http://localhost:3000/api/competences');
        const competenceExistante = response.data.find(
          comp => comp.nom.toLowerCase() === this.newCompetence.nom.toLowerCase()
        );

        if (competenceExistante) {
          this.competenceError = 'Cette compétence existe déjà !';
          return;
        }

        // Réinitialise le message d'erreur
        this.competenceError = '';

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
      } catch (error) {
        console.error("Erreur lors de la vérification de la compétence:", error);
        this.competenceError = "Erreur lors de la vérification de la compétence";
      }
    },

    // Annuler l'ajout d'une compétence
    cancelCompetence() {
      this.newCompetence = { nom: '', voie: '', type: '' };
      this.showCompetenceForm = false;
      this.competenceError = ''; // Réinitialise le message d'erreur
    },

    // Supprimer une compétence du personnage
    removeCompetence(index) {
      // Supprime la compétence de la liste locale du personnage
      this.character.competences.splice(index, 1);
    },
    cancelTargetSelection() {
      // Réinitialise la cible sélectionnée et ferme la modale
      this.selectedTarget = null;
      this.selectedCompetenceBackup = null; // Annule la compétence sélectionnée
      this.showTargetModal = false; // Ferme la modale
    },
    closeTargetModal() {
      this.showTargetModal = false;
      this.selectedTarget = null;
    },
    selectTarget(perso) {
      this.selectedTarget = perso;
    },
    confirmTargetSelection() {
      if (!this.selectedTarget) {
        alert("Veuillez sélectionner une cible !");
        return;
      }

      // Ouvre la modale pour vérifier si la compétence est réussie
      this.showTargetModal = false;
      this.showSuccessModal = true;
    },
    cancelSuccessCheck() {
      this.competenceSuccess = null;
      this.showSuccessModal = false;
      this.showTargetModal = true;
    },
    confirmSuccessCheck() {
      if (this.competenceSuccess === null) {
        alert("Veuillez sélectionner Oui ou Non !");
        return;
      }

      if (this.competenceSuccess === "Non") {
        // Si la compétence échoue, elle est mise en cooldown
        this.selectedCompetenceBackup.cooldownEnd = this.counter + 3;
        this.selectedCompetences = [this.selectedCompetenceBackup];
        this.resetModals();
      } else {
        // Si la compétence réussit, passe à la modale des dégâts
        this.showSuccessModal = false;
        this.showDamageModal = true;
      }
    },
    cancelDamageInput() {
      this.damageValue = null;
      this.showDamageModal = false;
      this.showSuccessModal = true;
    },
    confirmDamageInput() {
      if (this.damageValue === null || this.damageValue < 0) {
        alert("Veuillez entrer un nombre entier positif pour les dégâts !");
        return;
      }

      // Met la compétence en cooldown
      this.selectedCompetenceBackup.cooldownEnd = this.counter + 3;
      this.selectedCompetences = [this.selectedCompetenceBackup];
      this.resetModals();
    },
    resetModals() {
      this.selectedCompetenceBackup = null;
      this.selectedTarget = null;
      this.competenceSuccess = null;
      this.damageValue = null;
      this.showTargetModal = false;
      this.showSuccessModal = false;
      this.showDamageModal = false;
    },
    applyCompetenceEffect() {
      if (!this.selectedTarget || !this.selectedCompetenceBackup) {
        alert("Veuillez sélectionner une cible et une compétence !");
        return;
      }

      const target = this.selectedTarget; // Cible de l'action
      const competence = this.selectedCompetenceBackup; // Compétence utilisée
      const acteur = this.sortedCombatParticipants[this.selectedParticipantIndex]; // Acteur de l'action

      // Détermine si la compétence a réussi ou échoué
      const reussi = this.competenceSuccess === "Oui";

      // Initialise les dégâts à 0 par défaut
      let degats = 0;

      // Applique les effets uniquement si la compétence a réussi
      if (reussi) {
        if (competence.type === "Attaque") {
          degats = Math.max(0, this.damageValue - target.defenseValue); // Calcule les dégâts en tenant compte de la défense
          target.pv[0] = Math.max(0, target.pv[0] - degats); // Réduit les PV actuels de la cible
          target.defenseValue = 0; // Réinitialise la défense après l'attaque
        } else if (competence.type === "Soin") {
          degats = this.damageValue; // Les "dégâts" pour un soin sont positifs
          target.pv[0] = Math.min(target.pv[1], target.pv[0] + degats); // Augmente les PV actuels sans dépasser les PV max
        } else if (competence.type === "Défense") {
          degats = this.damageValue; // Les "dégâts" pour une défense représentent la valeur de défense
          target.defenseValue = degats; // Applique la valeur de défense
        }
      }

      // Enregistrer l'action dans le combat log
      const action = {
        acteur: acteur.nom, // Nom de l'acteur
        competence: {
          nom: competence.nom, // Nom de la compétence
          type: competence.type // Type de la compétence (Attaque, Soin, Défense)
        },
        cible: target.nom, // Nom de la cible
        reussi: reussi, // Indique si la compétence a réussi
        degats: degats, // Valeur des dégâts infligés (0 si échoué)
        pvActuels: this.sortedCombatParticipants.reduce((acc, perso) => {
          acc[perso.nom] = perso.pv[0]; // Enregistre les PV actuels de chaque participant
          return acc;
        }, {})
      };

      // Ajoute l'action au tour actuel
      const currentTour = this.counter; // Numéro du tour actuel
      let tour = this.combatLog.find(t => t.numero === currentTour); // Recherche le tour actuel dans le log
      if (!tour) {
        tour = { numero: currentTour, actions: [] }; // Crée un nouveau tour s'il n'existe pas
        this.combatLog.push(tour); // Ajoute le tour au log
      }
      tour.actions.push(action); // Ajoute l'action au tour

      // Met la compétence en cooldown
      competence.cooldownEnd = this.counter + 3; // Définit le cooldown de la compétence
      this.selectedCompetences = [competence]; // Met à jour la compétence sélectionnée

      // Réinitialise les modales et les sélections
      this.resetModals();
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  text-align: center;
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
  border: 1px solid #2c6578;
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

/* Styles pour la modale de sélection de cible */
.target-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.target-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.target-item:hover {
  background-color: #f0f0f0;
}

.target-item.selected {
  background-color: #c8aa6e;
  color: #fff;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #ccc;
  color: #333;
}

.cancel-btn:hover {
  background: #999;
}

.confirm-btn {
  background: #2c6578;
  color: #fff;
}

.confirm-btn:hover {
  background: #c8aa6e;
  color: #2c6578;
}

.radio-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.radio-group label {
  font-size: 1em;
  cursor: pointer;
}

.damage-input {
  width: 80%; /* Réduit la largeur de l'input */
  max-width: 200px; /* Limite la largeur maximale */
  padding: 8px;
  font-size: 1em;
  margin: 20px auto; /* Centre l'input horizontalement */
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  display: block; /* Permet de centrer avec margin auto */
}

/* Styles pour le message d'erreur des compétences */
.competence-error {
  color: #c65757;
  font-size: 0.9em;
  margin-top: 4px;
  margin-bottom: 8px;
}
</style>