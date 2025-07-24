<!--
  Ce composant affiche un formulaire de musique.
  Il permet de créer ou de modifier une musique.
  Il affiche le titre, l'artiste, le thème et le lien YouTube de la musique.
  Il permet de sauvegarder la musique.
  Il permet d'annuler les modifications.
-->

<template>
  <div class="musique-form">
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="titre">Titre</label>
        <input type="text" id="titre" v-model="formData.titre" required>
      </div>
      <div class="form-group">
        <label for="artiste">Artiste</label>
        <input type="text" id="artiste" v-model="formData.artiste" required>
      </div>
      <div class="form-group">
        <label for="theme">Thème</label>
        <input type="text" id="theme" v-model="formData.theme" required>
      </div>
      <div class="form-group">
        <label for="youtubeLink">Lien YouTube</label>
        <input type="url" id="youtubeLink" v-model="formData.youtubeLink" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn-submit">Ajouter</button>
        <button type="button" class="btn-cancel" @click="cancel">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MusiqueForm',
  data() {
    return {
      formData: {
        titre: '',
        artiste: '',
        theme: '',
        youtubeLink: ''
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/api/musiques', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        
        if (response.ok) {
          this.$emit('musique-added');
          this.resetForm();
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la musique:', error);
      }
    },
    cancel() {
      this.resetForm();
      this.$emit('cancel');
    },
    resetForm() {
      this.formData = {
        titre: '',
        artiste: '',
        theme: '',
        youtubeLink: ''
      };
    }
  }
}
</script>

<style scoped>
.musique-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-submit, .btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}
</style> 