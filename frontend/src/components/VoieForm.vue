<!--
  Ce composant affiche un formulaire de voie.
  Il permet de créer ou de modifier une voie.
  Il affiche le nom, la classe associée et la description de la voie.
  Il permet de sauvegarder la voie.
  Il permet d'annuler les modifications.
-->

<template>
  <!-- Formulaire d'ajout d'une nouvelle voie -->
  <div class="voie-form">
    <div class="edit-form">
      <h2>Ajouter une nouvelle voie</h2>
      
      <!-- Champ pour le nom de la voie, qui déclenche la génération du slug -->
      <div class="form-group">
        <label>Nom de la voie :</label>
        <input v-model="formData.nom" type="text" required @input="generateSlug">
      </div>

      <!-- Menu déroulant pour sélectionner la classe associée -->
      <div class="form-group">
        <label>Classe associée :</label>
        <select v-model="formData.classe_slug" required>
          <option value="">Sélectionner une classe</option>
          <!-- Boucle sur toutes les classes disponibles -->
          <option 
            v-for="classe in classes" 
            :key="classe.slug" 
            :value="classe.slug"
          >
            {{ classe.nom }}
          </option>
        </select>
      </div>

      <!-- Champ pour la description de la voie -->
      <div class="form-group">
        <label>Description :</label>
        <textarea v-model="formData.description" rows="4" required></textarea>
      </div>

      <!-- Boutons d'action du formulaire -->
      <div class="button-group">
        <button class="btn-save" @click="saveVoie">Ajouter la voie</button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoieForm',
  // Les classes sont passées en props depuis le composant parent
  props: {
    classes: {
      type: Array,
      required: true
    }
  },
  // Données locales du formulaire
  data() {
    return {
      formData: {
        nom: '',        // Nom de la voie
        slug: '',       // Slug généré automatiquement
        classe_slug: '', // Slug de la classe sélectionnée
        description: ''  // Description de la voie
      }
    }
  },
  methods: {
    // Génère un slug à partir du nom de la voie
    // Le slug est utilisé comme identifiant unique dans l'URL
    generateSlug() {
      this.formData.slug = this.formData.nom
        .toLowerCase()                    // Convertit en minuscules
        .normalize('NFD')                 // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, '')  // Supprime les accents
        .replace(/[^a-z0-9]+/g, '-')      // Remplace les caractères spéciaux par des tirets
        .replace(/(^-|-$)/g, '');         // Supprime les tirets au début et à la fin
    },
    // Envoie les données du formulaire au serveur
    async saveVoie() {
      try {
        // Appel à l'API pour créer la nouvelle voie
        const response = await fetch('http://localhost:3000/api/voies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création de la voie');
        }

        // Émet un événement pour informer le parent que la voie a été ajoutée
        this.$emit('voie-added');
        // Réinitialise le formulaire
        this.resetForm();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la création de la voie');
      }
    },
    // Réinitialise tous les champs du formulaire
    resetForm() {
      this.formData = {
        nom: '',
        slug: '',
        classe_slug: '',
        description: ''
      };
    }
  }
}
</script>

<style scoped>
/* Styles du conteneur principal du formulaire */
.voie-form {
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
  gap: 8px;
}

/* Style des labels */
.form-group label {
  font-weight: bold;
  color: #c8aa6e;
}

/* Style commun pour les champs de saisie */
input, select, textarea {
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
.btn-save, .btn-cancel {
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
</style> 