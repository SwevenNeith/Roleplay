<!--
  Ce composant affiche un formulaire de compétence.
  Il permet de créer ou de modifier une compétence.
  Il affiche le nom, le type, la description, le niveau, les dégâts, les effets sur les alliés, les effets sur les ennemis, la sauvegarde, la portée et la durée de la compétence.
  Il permet de sauvegarder la compétence.
  Il permet d'annuler les modifications.
-->

<template>
  <!-- Formulaire d'ajout d'une nouvelle compétence -->
  <div class="competence-form">
    <div class="edit-form">
      <h2 v-if="initialData">Modifier la compétence</h2>
      <h2 v-else>Ajouter une compétence</h2>

      <!-- Champ pour le nom de la compétence (obligatoire) -->
      <div class="form-group">
        <label>Nom de la compétence :</label>
        <input
          v-model="formData.nom"
          type="text"
          required
          @input="generateSlug"
        />
      </div>

      <!-- Champ pour le système utilisé pour la compétence -->
      <div class="form-group">
        <label>Système :</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="formData.systeme === 'D&D'"
              @change="updateSystem('D&D')"
            />
            D&D
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="formData.systeme === 'Chroniques Oubliées'"
              @change="updateSystem('Chroniques Oubliées')"
            />
            Chroniques Oubliées
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="formData.systeme === 'Mixte'"
              @change="updateSystem('Mixte')"
            />
            Mixte
          </label>
        </div>
      </div>



      <!-- Formulaire Chroniques Oubliées -->
      <div v-if="formData.systeme === 'Chroniques Oubliées'" class="co-form">
        <div class="form-section">
          <h3>Détails de la Compétence</h3>
          
          <!-- Rang (Niveau) -->
          <div class="form-group">
            <label>Rang :</label>
            <select v-model="formData.niveau">
              <option value="">Sélectionner un rang</option>
              <option v-for="n in 5" :key="n" :value="n">Rang {{ n }}</option>
            </select>
          </div>

          <!-- Effet exact -->
          <div class="form-group">
            <label>Effet exact :</label>
            <textarea 
              v-model="formData.description" 
              rows="6" 
              placeholder="Description complète de l'effet (bonus, dégâts, capacités spéciales...)"
            ></textarea>
          </div>

          <!-- Type d'action -->
          <div class="form-group">
            <label>Type d'action :</label>
            <select v-model="formData.co_type_action">
              <option value="">Sélectionner</option>
              <option value="Action">Action</option>
              <option value="Action limitée">Action limitée</option>
              <option value="Réaction">Réaction</option>
              <option value="Automatique">Automatique</option>
              <option value="Autre">Autre</option>
            </select>
            <input 
              v-if="formData.co_type_action === 'Autre'" 
              v-model="formData.co_type_action_autre" 
              type="text" 
              placeholder="Préciser le type d'action" 
              style="margin-top: 10px;"
            >
          </div>

          <!-- Conditions d'usage -->
          <div class="form-group">
            <label>Conditions d'usage :</label>
            <textarea 
              v-model="formData.co_conditions" 
              rows="3" 
              placeholder="Cible visible, arme requise, situation particulière..."
            ></textarea>
          </div>

          <!-- Fréquence -->
          <div class="form-group">
            <label>Fréquence :</label>
            <select v-model="formData.co_frequence">
              <option value="">Sélectionner</option>
              <option value="Illimité">Illimité</option>
              <option value="1/combat">1/combat</option>
              <option value="1/repos long">1/repos long</option>
              <option value="X fois/jour">X fois/jour</option>
              <option value="Autre">Autre</option>
            </select>
            <input 
              v-if="['X fois/jour', 'Autre'].includes(formData.co_frequence)" 
              v-model="formData.co_frequence_valeur" 
              type="text" 
              placeholder="Préciser la fréquence" 
              style="margin-top: 10px;"
            >
          </div>

          <!-- Jets nécessaires -->
          <div class="form-group">
            <label>Jets nécessaires :</label>
            <textarea 
              v-model="formData.co_jets" 
              rows="3" 
              placeholder="Attaque, sauvegarde, test de caractéristique..."
            ></textarea>
          </div>

          <!-- Portée -->
          <div class="form-group">
            <label>Portée :</label>
            <input 
              v-model="formData.co_portee" 
              type="text" 
              placeholder="Ex: Contact, 10m, Ligne de vue..."
            >
          </div>

          <!-- Durée -->
          <div class="form-group">
            <label>Durée :</label>
            <input 
              v-model="formData.co_duree" 
              type="text" 
              placeholder="Ex: Instantané, 1 round, Concentration..."
            >
          </div>
        </div>
      </div>

      <!-- Message pour les systèmes en cours de développement (Mixte uniquement maintenant) -->
      <div v-if="formData.systeme === 'Mixte'" class="info-message">
        <p>La création du formulaire de ce système est en cours...</p>
      </div>

      <!-- Champs par défaut (Masqués pour l'instant) -->
      <div v-if="false">
        <!-- Dropdown pour la classe -->
        <div class="form-group" v-if="!voieSlug">
          <label>Classe :</label>
          <select v-model="selectedClasseSlug">
            <option value="">Sélectionner une classe</option>
            <option
              v-for="classe in classes"
              :key="classe.slug"
              :value="classe.slug"
            >
              {{ classe.nom }}
            </option>
          </select>
        </div>

        <!-- Dropdown pour la voie (dépend de la classe) -->
        <div class="form-group" v-if="!voieSlug && selectedClasseSlug">
          <label>Voie :</label>
          <select v-model="formData.voie_slug">
            <option value="">Sélectionner une voie</option>
            <option
              v-for="voie in filteredVoies"
              :key="voie.slug"
              :value="voie.slug"
            >
              {{ voie.nom }}
            </option>
          </select>
        </div>

        <!-- Champ pour la description de la compétence -->
        <div class="form-group">
          <label>Description :</label>
          <textarea v-model="formData.description" rows="4"></textarea>
        </div>

        <!-- Champ pour les prérequis de la compétence -->
        <div class="form-group">
          <label>Prérequis :</label>
          <input v-model="formData.prerequis" type="text" />
        </div>

        <!-- Menu déroulant pour le niveau de la compétence (1 à 5) -->
        <div class="form-group">
          <label>Niveau :</label>
          <select v-model="formData.niveau">
            <option value="">Sélectionner un niveau</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- Champ pour les composants de la compétence -->
        <div class="form-group">
          <label>Composant(s) :</label>
          <div style="display: flex; gap: 10px">
            <label
              ><input
                type="checkbox"
                value="Verbal"
                v-model="formData.composant"
              />
              Verbal</label
            >
            <label
              ><input
                type="checkbox"
                value="Matériel"
                v-model="formData.composant"
              />
              Matériel</label
            >
            <label
              ><input
                type="checkbox"
                value="Somatique"
                v-model="formData.composant"
              />
              Somatique</label
            >
          </div>
        </div>

        <!-- Champ pour la portée de la compétence -->
        <div class="form-group">
          <label>Portée :</label>
          <input v-model="formData.portee" type="text" />
        </div>

        <!-- Champ pour la zone d'effet -->
        <div class="form-group">
          <label>Zone d'effet :</label>
          <input v-model="formData.zone" type="text" />
        </div>

        <!-- Champ pour la durée de l'incantation -->
        <div class="form-group">
          <label>Temps d'incantation :</label>
          <input v-model="formData.temps_incantation" type="text" />
        </div>

        <!-- Champ pour la durée de la compétence -->
        <div class="form-group">
          <label>Durée :</label>
          <input v-model="formData.duree" type="text" />
        </div>

        <!-- Champ pour les dégâts de la compétence -->
        <div class="form-group">
          <label>Dégâts :</label>
          <input v-model="formData.degats" type="text" />
        </div>

        <!-- Champ pour les effets sur les alliés -->
        <div class="form-group">
          <label>Effets sur les alliés :</label>
          <textarea v-model="formData.allie" rows="2"></textarea>
        </div>

        <!-- Champ pour les effets sur les ennemis -->
        <div class="form-group">
          <label>Effets sur les ennemis :</label>
          <textarea v-model="formData.ennemi" rows="2"></textarea>
        </div>

        <!-- Champ pour la sauvegarde de la compétence -->
        <div class="form-group">
          <label>Sauvegarde :</label>
          <input v-model="formData.sauvegarde" type="text" />
        </div>
      </div>

      <!-- FORMULAIRE D&D -->
      <div v-if="formData.systeme === 'D&D'" class="dnd-form">
        <!-- Partie 1 : Informations Générales -->
        <div class="form-section">
          <h3>Informations Générales</h3>
          <div class="form-group">
            <label>Type :</label>
            <select v-model="formData.type">
              <option value="">Sélectionner un type</option>
              <option value="Capacité/Talent/Technique">Capacité/Talent/Technique</option>
              <option value="Sort">Sort</option>
              <option value="Action spéciale">Action spéciale</option>
              <option value="Trait de classe/racial">Trait de classe/racial</option>
              <option value="Autre">Autre</option>
            </select>
            <input v-if="formData.type === 'Autre'" v-model="formData.type_custom" type="text" placeholder="Préciser le type" style="margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Niveau :</label>
            <select v-model="formData.niveau">
              <option value="">Sélectionner un niveau</option>
              <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ecole de magie :</label>
            <input list="ecoles-magie" v-model="formData.ecole_magie" placeholder="Sélectionner ou saisir...">
            <datalist id="ecoles-magie">
              <option value="Abjuration"></option>
              <option value="Invocation"></option>
              <option value="Divination"></option>
              <option value="Enchantement"></option>
              <option value="Evocation"></option>
              <option value="Illusion"></option>
              <option value="Nécromancie"></option>
              <option value="Transmutation"></option>
            </datalist>
          </div>
          <!-- Input Tag (Thèmes) -->
          <div class="form-group">
            <label>Tags :</label>
            <input
              v-model="themeInput"
              type="text"
              placeholder="Ex : maitre de l'air, vent, feu"
            />
            <small>Plusieurs tags séparés par une virgule.</small>
          </div>
        </div>

        <!-- Partie 2 : Coûts et Activation -->
        <div class="form-section">
          <h3>Coûts et Activation</h3>
          <div class="form-group">
            <label>Type d'action requise :</label>
            <select v-model="formData.type_action">
              <option value="">Sélectionner</option>
              <option value="Action">Action</option>
              <option value="Action Bonus">Action Bonus</option>
              <option value="Réaction">Réaction</option>
              <option value="Action de Mouvement">Action de Mouvement</option>
              <option value="Action Libre">Action Libre</option>
              <option value="Autre">Autre</option>
            </select>
            <input v-if="formData.type_action === 'Autre'" v-model="formData.type_action_custom" type="text" placeholder="Préciser le type d'action" style="margin-top: 5px;">
          </div>
          <div class="form-group" v-if="formData.type_action === 'Réaction'">
            <label>Condition de Déclenchement :</label>
            <input v-model="formData.condition_declenchement" type="text" />
          </div>
          <div class="form-group">
            <label>Composantes :</label>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <label><input type="checkbox" value="Verbal" v-model="formData.composant"> Verbal</label>
              <label><input type="checkbox" value="Somatique" v-model="formData.composant"> Somatique</label>
              <label><input type="checkbox" value="Matériel" v-model="formData.composant"> Matériel</label>
            </div>
            <div v-if="formData.composant.includes('Matériel')" style="margin-top: 10px;">
              <input v-model="formData.composante_materielle_details" type="text" placeholder="Détails du matériel" style="margin-bottom: 5px;">
              <label><input type="checkbox" v-model="formData.composante_materielle_consommee"> Consommée ?</label>
            </div>
          </div>
        </div>

        <!-- Partie 3 : Portée & Cibles -->
        <div class="form-section">
          <h3>Portée & Cibles</h3>
          <div class="form-group">
            <label>Portée :</label>
            <select v-model="formData.portee_type">
              <option value="">Sélectionner</option>
              <option value="Personnelle">Personnelle</option>
              <option value="Toucher">Toucher</option>
              <option value="Distance fixe">Distance fixe</option>
              <option value="Ligne de vue">Ligne de vue</option>
              <option value="Rayon">Rayon</option>
            </select>
            <input v-if="['Distance fixe', 'Rayon'].includes(formData.portee_type)" v-model="formData.portee_distance" type="text" placeholder="Distance en m" style="margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Zone d'effet :</label>
            <select v-model="formData.zone_type">
              <option value="">Aucune / Sélectionner</option>
              <option value="Cône">Cône</option>
              <option value="Ligne">Ligne</option>
              <option value="Sphère">Sphère</option>
              <option value="Cube">Cube</option>
            </select>
            <input v-if="formData.zone_type" v-model="formData.zone_taille" type="text" placeholder="Taille en m" style="margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Cible :</label>
            <select v-model="formData.cible_type">
              <option value="">Sélectionner</option>
              <option value="Unique">Unique</option>
              <option value="Plusieurs">Plusieurs</option>
              <option value="Toutes dans la zone">Toutes dans la zone</option>
              <option value="Auto-ciblage uniquement">Auto-ciblage uniquement</option>
            </select>
            <input v-if="formData.cible_type === 'Plusieurs'" v-model="formData.cible_nombre" type="number" placeholder="Nombre de cibles" style="margin-top: 5px;">
          </div>
        </div>

        <!-- Partie 4 : Jet requis -->
        <div class="form-section">
          <h3>Jet requis</h3>
          <div class="form-group">
            <label>Jet d'attaque :</label>
            <select v-model="formData.jet_attaque_type">
              <option value="">Sélectionner</option>
              <option value="Corps à Corps">Corps à Corps</option>
              <option value="A distance">A distance</option>
              <option value="Magique">Magique</option>
            </select>
          </div>
          <div class="form-group" v-if="formData.jet_attaque_type">
            <label>Modificateur :</label>
            <select v-model="formData.jet_attaque_modificateur">
              <option value="">Sélectionner</option>
              <option v-for="mod in ['INT', 'SAG', 'FOR', 'DEX', 'CON', 'CHA']" :key="mod" :value="mod">{{ mod }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Test de Sauvegarde :</label>
            <select v-model="formData.sauvegarde_attribut">
              <option value="">Sélectionner</option>
              <option v-for="attr in ['INT', 'SAG', 'FOR', 'DEX', 'CON', 'CHA']" :key="attr" :value="attr">{{ attr }}</option>
            </select>
          </div>
          <div class="form-group" v-if="formData.sauvegarde_attribut">
            <label>Résultat en cas de réussite :</label>
            <select v-model="formData.sauvegarde_reussite">
              <option value="">Sélectionner</option>
              <option value="Aucun effet">Aucun effet</option>
              <option value="Demi-dégâts">Demi-dégâts</option>
              <option value="Effet réduit">Effet réduit</option>
            </select>
            <input v-if="formData.sauvegarde_reussite === 'Effet réduit'" v-model="formData.sauvegarde_effet_reduit" type="text" placeholder="Préciser l'effet réduit" style="margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Degré de Difficulté :</label>
            <input v-model="formData.degre_difficulte" type="text" placeholder="Ex: 8 + Maitrise + Mod">
          </div>
        </div>

        <!-- Partie 5 : Effets -->
        <div class="form-section">
          <h3>Effets</h3>
          <div class="form-group">
            <label>Effet principal :</label>
            <textarea v-model="formData.effet_principal" rows="4" placeholder="Détailler clairement ce que fait la capacité / le sort."></textarea>
          </div>
          <div class="form-group">
            <label>Dégâts :</label>
            <input v-model="formData.degats_formule" type="text" placeholder="Formule (ex : 2d8 + mod)">
            <input v-model="formData.degats_type" type="text" placeholder="Type de dégâts (feu, nécrotique...)" style="margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Effets secondaires :</label>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 15px;">
              <label><input type="checkbox" value="Aveuglé" v-model="formData.effets_secondaires"> Aveuglé</label>
              <label><input type="checkbox" value="Charmé" v-model="formData.effets_secondaires"> Charmé</label>
              <label><input type="checkbox" value="Repoussé" v-model="formData.effets_secondaires"> Repoussé</label>
              <label><input type="checkbox" value="Immobilisé" v-model="formData.effets_secondaires"> Immobilisé</label>
              <label><input type="checkbox" value="Avantage / Désavantage" v-model="formData.effets_secondaires"> Avantage / Désavantage</label>
              <label><input type="checkbox" value="Autre" v-model="formData.effets_secondaires"> Autre</label>
            </div>
            <!-- Inputs conditionnels pour les effets secondaires -->
            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
              <input v-if="formData.effets_secondaires.includes('Repoussé')" v-model="formData.effets_secondaires_repousse_distance" type="text" placeholder="Distance de repoussement ?">
              <input v-if="formData.effets_secondaires.includes('Autre')" v-model="formData.effets_secondaires_autre" type="text" placeholder="Préciser l'autre effet">
            </div>
          </div>
          <div class="form-group">
            <label>Durée :</label>
            <select v-model="formData.duree_type">
              <option value="">Sélectionner</option>
              <option value="Instantané">Instantané</option>
              <option value="1 round">1 round</option>
              <option value="X rounds">X rounds</option>
              <option value="Concentration">Concentration</option>
              <option value="Fixe">Fixe</option>
            </select>
            <div v-if="['X rounds', 'Concentration', 'Fixe'].includes(formData.duree_type)" style="margin-top: 10px; display: flex; flex-direction: column; gap: 10px;">
              <input v-if="formData.duree_type === 'X rounds'" v-model="formData.duree_valeur" type="text" placeholder="Nombre de rounds">
              <input v-if="formData.duree_type === 'Concentration'" v-model="formData.duree_valeur" type="text" placeholder="Durée max">
              <input v-if="formData.duree_type === 'Fixe'" v-model="formData.duree_valeur" type="text" placeholder="minutes / heures...">
            </div>
          </div>
          <div class="form-group">
            <label>Peut être dissipé ?</label>
            <div style="display: flex; gap: 10px;">
              <label><input type="radio" :value="true" v-model="formData.dissipable"> Oui</label>
              <label><input type="radio" :value="false" v-model="formData.dissipable"> Non</label>
            </div>
          </div>
        </div>

        <!-- Partie 6 : Notes & Lore -->
        <div class="form-section">
          <h3>Notes & Lore</h3>
          <div class="form-group">
            <textarea v-model="formData.notes_lore" rows="4" placeholder="Description narrative..."></textarea>
          </div>
        </div>
      </div>



      <!-- Boutons d'action du formulaire -->
      <div class="button-group">
        <button class="btn-save" @click="saveCompetence">
          {{
            initialData
              ? "Enregistrer les modifications"
              : "Ajouter la compétence"
          }}
        </button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompetenceForm",
  // Props reçues du composant parent
  props: {
    voieSlug: {
      type: String,
      required: false, // Le slug de la voie n'est plus obligatoire
    },
    initialData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  // Données locales du formulaire
  data() {
    return {
      formData: {
        nom: "", // Nom de la compétence (obligatoire)
        slug: "", // Slug généré automatiquement
        voie_slug: "", // Slug de la voie associée
        systeme: "", // Système (D&D, Chroniques Oubliées, Mixte)
        systeme_value: "", // Valeur du système
        type: "", // Type de compétence (Attaque, Soin, Défense)
        description: "", // Description de la compétence
        niveau: "", // Niveau de la compétence (1-5)
        degats: "", // Dégâts infligés
        allie: "", // Effets sur les alliés
        ennemi: "", // Effets sur les ennemis
        sauvegarde: "", // Type de sauvegarde
        portee: "", // Portée de la compétence
        duree: "", // Durée des effets
        temps_incantation: "",
        zone: "",
        prerequis: "",
        theme: [],
        composant: [], // Composants sélectionnés
        
        // Champs D&D
        ecole_magie: '',
        type_action: '',
        condition_declenchement: '',
        composante_materielle_details: '',
        composante_materielle_consommee: false,
        portee_type: '',
        portee_distance: '',
        zone_type: '',
        zone_taille: '',
        cible_type: '',
        cible_nombre: '',
        jet_attaque_type: '',
        jet_attaque_modificateur: '',
        sauvegarde_attribut: '',
        sauvegarde_reussite: '',
        sauvegarde_effet_reduit: '',
        degre_difficulte: '',
        effet_principal: '',
        degats_formule: '',
        degats_type: '',
        effets_secondaires: [],
        effets_secondaires_repousse_distance: '',
        effets_secondaires_autre: '',
        duree_type: '',
        duree_valeur: '',
        concentration: false,
        dissipable: false,
        notes_lore: '',
        type_custom: '', // Champ temporaire pour l'input "Autre" du type
        type_action_custom: '', // Champ temporaire pour l'input "Autre" du type d'action

        // Champs Chroniques Oubliées
        co_type_action: '',
        co_type_action_autre: '',
        co_conditions: '',
        co_frequence: '',
        co_frequence_valeur: '',
        co_jets: '',
        co_portee: '',
        co_duree: ''
      },
      classes: [],
      voies: [],
      selectedClasseSlug: "",
      themeInput: "",
    };
  },
  computed: {
    filteredVoies() {
      return this.voies.filter(
        (v) => v.classe_slug === this.selectedClasseSlug
      );
    },
  },
  watch: {
    voieSlug: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData.voie_slug = newVal;
        }
      },
    },
    selectedClasseSlug(newSlug) {
      // Réinitialise la voie si la classe change
      this.formData.voie_slug = "";
    },
  },
  created() {
    // Voir Explication/Explication_Formulaire_Competence.md pour les détails sur la logique de chargement
    if (!this.voieSlug) {
      this.fetchClassesAndVoies();
    }
    // Pré-remplissage si édition
    if (this.initialData) {
      this.formData = {
        ...this.initialData,
        niveau: this.initialData.niveau || "",
        theme: this.initialData.theme || [],
        composant: this.initialData.composant || [],
      };

      // Gestion des champs "Autre" pour Type
      const standardTypes = ["Capacité/Talent/Technique", "Sort", "Action spéciale", "Trait de classe/racial"];
      if (this.formData.type && !standardTypes.includes(this.formData.type)) {
        this.formData.type_custom = this.formData.type;
        this.formData.type = "Autre";
      }

      // Gestion des champs "Autre" pour Type d'action
      const standardActionTypes = ["Action", "Action Bonus", "Réaction", "Action de Mouvement", "Action Libre"];
      if (this.formData.type_action && !standardActionTypes.includes(this.formData.type_action)) {
        this.formData.type_action_custom = this.formData.type_action;
        this.formData.type_action = "Autre";
      }

      // Pour l'input texte des thèmes
      this.themeInput = (this.initialData.theme || []).join(", ");
      // Pour la sélection de la classe (si possible)
      if (this.initialData.voie_slug && !this.voieSlug) {
        // On attend que les voies soient chargées pour setter la classe
        this.fetchClassesAndVoies().then(() => {
          const voie = this.voies.find(
            (v) => v.slug === this.initialData.voie_slug
          );
          if (voie) this.selectedClasseSlug = voie.classe_slug;
        });
      }
    }
  },
  methods: {
    // Génère un slug à partir du nom de la compétence
    // Le slug est utilisé comme identifiant unique dans l'URL
    generateSlug() {
      this.formData.slug = this.formData.nom
        .toLowerCase() // Convertit en minuscules
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9]+/g, "-") // Remplace les caractères spéciaux par des tirets
        .replace(/(^-|-$)/g, ""); // Supprime les tirets au début et à la fin
    },
    async fetchClassesAndVoies() {
      try {
        const [classesRes, voiesRes] = await Promise.all([
          fetch("http://localhost:3000/api/classes"),
          fetch("http://localhost:3000/api/voies"),
        ]);
        this.classes = await classesRes.json();
        this.voies = await voiesRes.json();
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des classes ou voies:",
          error
        );
      }
    },
    // Envoie les données du formulaire au serveur
    // Voir Explication/Explication_Formulaire_Competence.md pour la gestion des champs "Autre"
    async saveCompetence() {
      try {
        // Validation : seul le nom est obligatoire
        if (!this.formData.nom) {
          alert("Veuillez remplir le nom de la compétence.");
          return;
        }
        // Ajoute le slug de la voie aux données seulement si défini
        if (this.voieSlug) {
          this.formData.voie_slug = this.voieSlug;
        }
        // Conversion du niveau en nombre si renseigné
        if (this.formData.niveau) {
          this.formData.niveau = Number(this.formData.niveau);
        } else {
          this.formData.niveau = undefined;
        }
        // Découpe le champ thème en tableau
        if (this.themeInput) {
          this.formData.theme = this.themeInput
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t);
        } else {
          this.formData.theme = [];
        }

        // Préparation des données à envoyer
        const dataToSend = { ...this.formData };

        // Si "Autre" est sélectionné, on utilise la valeur personnalisée
        if (dataToSend.type === 'Autre') {
          dataToSend.type = dataToSend.type_custom;
        }
        if (dataToSend.type_action === 'Autre') {
          dataToSend.type_action = dataToSend.type_action_custom;
        }

        // Suppression des champs temporaires
        delete dataToSend.type_custom;
        delete dataToSend.type_action_custom;

        let response;
        if (this.initialData && this.initialData.slug) {
          // Édition : PUT
          response = await fetch(
            `http://localhost:3000/api/competences/${this.initialData.slug}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            }
          );
        } else {
          // Création : POST
          response = await fetch("http://localhost:3000/api/competences", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          });
        }

        if (!response.ok) {
          throw new Error(
            this.initialData
              ? "Erreur lors de la modification de la compétence"
              : "Erreur lors de la création de la compétence"
          );
        }

        // Émet un événement pour informer le parent que la compétence a été ajoutée ou modifiée
        if (this.initialData) {
          this.$emit("competence-updated");
        } else {
          this.$emit("competence-added");
        }
        // Réinitialise le formulaire
        this.resetForm();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la sauvegarde de la compétence");
      }
    },
    // Réinitialise tous les champs du formulaire
    resetForm() {
      this.formData = {
        nom: "",
        slug: "",
        voie_slug: "",
        systeme: "",
        systeme_value: "",
        type: "",
        description: "",
        niveau: "",
        degats: "",
        allie: "",
        ennemi: "",
        sauvegarde: "",
        portee: "",
        duree: "",
        temps_incantation: "",
        zone: "",
        prerequis: "",
        theme: [],
        composant: [],
        
        // Champs D&D
        ecole_magie: '',
        type_action: '',
        condition_declenchement: '',
        composante_materielle_details: '',
        composante_materielle_consommee: false,
        portee_type: '',
        portee_distance: '',
        zone_type: '',
        zone_taille: '',
        cible_type: '',
        cible_nombre: '',
        jet_attaque_type: '',
        jet_attaque_modificateur: '',
        sauvegarde_attribut: '',
        sauvegarde_reussite: '',
        sauvegarde_effet_reduit: '',
        degre_difficulte: '',
        effet_principal: '',
        degats_formule: '',
        degats_type: '',
        effets_secondaires: [],
        effets_secondaires_repousse_distance: '',
        effets_secondaires_autre: '',
        duree_type: '',
        duree_valeur: '',
        concentration: false,
        dissipable: false,
        notes_lore: '',
        type_custom: '',
        type_action_custom: '',

        // Champs Chroniques Oubliées
        co_type_action: '',
        co_type_action_autre: '',
        co_conditions: '',
        co_frequence: '',
        co_frequence_valeur: '',
        co_jets: '',
        co_portee: '',
        co_duree: ''
      };
      this.themeInput = "";
    },
    // Met à jour le système sélectionné (comportement radio avec désélection)
    // Voir Explication/Explication_Formulaire_Competence.md pour la logique de visibilité
    updateSystem(value) {
      if (this.formData.systeme === value) {
        this.formData.systeme = ''; // Désélectionne si on clique sur le système déjà actif
      } else {
        this.formData.systeme = value;
      }
    },
  },
};
</script>

<style scoped>
/* Style du conteneur principal du formulaire */
.competence-form {
  background: #18182a;
  border: 1px solid #2c6578;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: #c8aa6e;
}

/* Mise en page du formulaire */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Style du titre */
h2 {
  color: #c8aa6e;
  margin-bottom: 20px;
  border-bottom: 2px solid #2c6578;
  padding-bottom: 10px;
}

/* Style des groupes de champs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

/* Style des labels */
.form-group label {
  font-weight: bold;
  color: #c8aa6e;
}

/* Style commun pour les champs de saisie */
input,
select,
textarea {
  padding: 10px;
  border: 1px solid #2c6578;
  border-radius: 4px;
  background: #23233a;
  color: #fff;
  font-size: 14px;
}

/* Style spécifique pour la zone de texte */
textarea {
  resize: vertical;
  min-height: 100px;
}

/* Mise en page des boutons */
.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Style commun pour les boutons */
.btn-save,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

/* Style du bouton de sauvegarde */
.btn-save {
  background-color: #2c6578;
  color: white;
}

/* Style du bouton d'annulation */
.btn-cancel {
  background-color: #4a4a4a;
  color: white;
}

/* Effets de survol des boutons */
.btn-save:hover {
  background-color: #1e4a5a;
}

.btn-cancel:hover {
  background-color: #333;
}

.checkbox-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #fff;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #2c6578;
  width: 16px;
  height: 16px;
  margin: 0;
}

/* Styles pour le formulaire D&D */
.dnd-form,
.co-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.form-section {
  background: #23233a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2c6578;
}

.form-section h3 {
  color: #c8aa6e;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #2c6578;
  padding-bottom: 10px;
  font-size: 1.2em;
}

.info-message {
  background: #23233a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2c6578;
  text-align: center;
  color: #c8aa6e;
  font-style: italic;
  margin-top: 20px;
}
</style>
