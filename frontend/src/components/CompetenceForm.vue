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
      <h2>Ajouter une nouvelle compétence</h2>
      
      <!-- Champ pour le nom de la compétence (obligatoire) -->
      <div class="form-group">
        <label>Nom de la compétence :</label>
        <input v-model="formData.nom" type="text" required @input="generateSlug">
      </div>

      <!-- Menu déroulant pour le type de compétence (Attaque, Soin, Défense) -->
      <div class="form-group">
        <label>Type de compétence :</label>
        <select v-model="formData.type">
          <option value="">Sélectionner un type</option>
          <option value="Attaque">Attaque</option>
          <option value="Soin">Soin</option>
          <option value="Défense">Défense</option>
        </select>
      </div>

      <!-- Champ pour la description de la compétence -->
      <div class="form-group">
        <label>Description :</label>
        <textarea v-model="formData.description" rows="4"></textarea>
      </div>

      <!-- Menu déroulant pour le niveau de la compétence (1 à 5) -->
      <div class="form-group">
        <label>Niveau :</label>
        <select v-model="formData.niveau">
          <option value="">Sélectionner un niveau</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <!-- Champ pour les dégâts de la compétence -->
      <div class="form-group">
        <label>Dégâts :</label>
        <input v-model="formData.degats" type="text">
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
        <input v-model="formData.sauvegarde" type="text">
      </div>

      <!-- Champ pour la portée de la compétence -->
      <div class="form-group">
        <label>Portée :</label>
        <input v-model="formData.portee" type="text">
      </div>

      <!-- Champ pour la durée de la compétence -->
      <div class="form-group">
        <label>Durée :</label>
        <input v-model="formData.duree" type="text">
      </div>

      <!-- Boutons d'action du formulaire -->
      <div class="button-group">
        <button class="btn-save" @click="saveCompetence">Ajouter la compétence</button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetenceForm',
  // Props reçues du composant parent
  props: {
    voieSlug: {
      type: String,
      required: true // Le slug de la voie est obligatoire
    }
  },
  // Données locales du formulaire
  data() {
    return {
      formData: {
        nom: '',        // Nom de la compétence (obligatoire)
        slug: '',       // Slug généré automatiquement
        voie_slug: '',  // Slug de la voie associée
        type: '',       // Type de compétence (Attaque, Soin, Défense)
        description: '', // Description de la compétence
        niveau: '',     // Niveau de la compétence (1-5)
        degats: '',     // Dégâts infligés
        allie: '',      // Effets sur les alliés
        ennemi: '',     // Effets sur les ennemis
        sauvegarde: '', // Type de sauvegarde
        portee: '',     // Portée de la compétence
        duree: ''       // Durée des effets
      }
    }
  },
  methods: {
    // Génère un slug à partir du nom de la compétence
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
    async saveCompetence() {
      try {
        // Ajoute le slug de la voie aux données
        this.formData.voie_slug = this.voieSlug;

        // Appel à l'API pour créer la nouvelle compétence
        const response = await fetch('http://localhost:3000/api/competences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création de la compétence');
        }

        // Émet un événement pour informer le parent que la compétence a été ajoutée
        this.$emit('competence-added');
        // Réinitialise le formulaire
        this.resetForm();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la création de la compétence');
      }
    },
    // Réinitialise tous les champs du formulaire
    resetForm() {
      this.formData = {
        nom: '',
        slug: '',
        voie_slug: '',
        type: '',
        description: '',
        niveau: '',
        degats: '',
        allie: '',
        ennemi: '',
        sauvegarde: '',
        portee: '',
        duree: ''
      };
    }
  }
}
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