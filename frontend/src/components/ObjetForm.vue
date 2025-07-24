<template>
  <div class="objet-form">
    <h2 v-if="initialData">Modifier l'objet</h2>
    <h2 v-else>Ajouter un objet</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nom">Nom</label>
        <input type="text" id="nom" v-model="formData.nom" required @input="generateSlug">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="formData.description"></textarea>
      </div>
      <div class="button-group">
        <button class="btn-save" type="submit">{{ initialData ? 'Enregistrer les modifications' : "Ajouter l'objet" }}</button>
        <button class="btn-cancel" type="button" @click="$emit('cancel')">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ObjetForm',
  props: {
    initialData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      formData: {
        nom: '',
        slug: '',
        description: ''
      }
    }
  },
  created() {
    // Pré-remplissage si édition
    if (this.initialData) {
      this.formData = {
        nom: this.initialData.nom || '',
        slug: this.initialData.slug || '',
        description: this.initialData.description || ''
      };
    }
  },
  methods: {
    // Génère un slug à partir du nom
    generateSlug() {
      this.formData.slug = this.formData.nom
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    },
    // Soumet le formulaire : POST si création, PUT si édition
    async handleSubmit() {
      try {
        let response;
        if (this.initialData && this.initialData.slug) {
          // Édition : PUT
          response = await fetch(`http://localhost:3000/api/objets/${this.initialData.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.formData)
          });
        } else {
          // Création : POST
          response = await fetch('http://localhost:3000/api/objets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.formData)
          });
        }
        if (!response.ok) throw new Error("Erreur lors de la sauvegarde de l'objet");
        if (this.initialData) {
          this.$emit('objet-updated');
        } else {
          this.$emit('objet-added');
        }
        this.formData = { nom: '', slug: '', description: '' };
      } catch (error) {
        alert("Erreur lors de la sauvegarde de l'objet");
      }
    }
  }
}
</script>

<style scoped>
.objet-form {
  background: #18182a;
  border: 1px solid #2c6578;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: #c8aa6e;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
label {
  font-weight: bold;
  color: #c8aa6e;
}
input, textarea {
  padding: 10px;
  border: 1px solid #2c6578;
  border-radius: 4px;
  background: #23233a;
  color: #fff;
  font-size: 14px;
}
textarea {
  resize: vertical;
  min-height: 80px;
}
.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-save, .btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.btn-save {
  background-color: #2c6578;
  color: white;
}
.btn-cancel {
  background-color: #4a4a4a;
  color: white;
}
.btn-save:hover {
  background-color: #1e4a5a;
}
.btn-cancel:hover {
  background-color: #333;
}
</style>