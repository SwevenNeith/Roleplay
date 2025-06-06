<template>
  <div class="classe-form">
    <div class="edit-form">
      <h2>Ajouter une nouvelle classe</h2>
      
      <div class="form-group">
        <label>Nom de la classe :</label>
        <input v-model="formData.nom" type="text" required @input="generateSlug">
      </div>

      <div class="form-group">
        <label>Description :</label>
        <textarea v-model="formData.description" rows="4" required></textarea>
      </div>

      <div class="form-group">
        <label>URL de l'image :</label>
        <input v-model="formData.image" type="url">
      </div>

      <div class="caracteristiques-section">
        <h3>Caractéristiques principales</h3>
        <div class="caracteristiques-grid">
          <div class="form-group">
            <label>Première caractéristique :</label>
            <select v-model="formData.caracteristiques[0]" required>
              <option value="">Sélectionner</option>
              <option 
                v-for="carac in availableCaracteristiques" 
                :key="carac" 
                :value="carac"
              >
                {{ carac }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Deuxième caractéristique :</label>
            <select v-model="formData.caracteristiques[1]">
              <option value="">Sélectionner</option>
              <option 
                v-for="carac in availableCaracteristiques" 
                :key="carac" 
                :value="carac"
                :disabled="formData.caracteristiques[0] === carac"
              >
                {{ carac }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button class="btn-save" @click="saveClasse">Ajouter la classe</button>
        <button class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClasseForm',
  data() {
    return {
      formData: {
        nom: '',
        slug: '',
        description: '',
        caracteristiques: ['', ''],
        image: ''
      },
      allCaracteristiques: [
        'Force',
        'Dextérité',
        'Constitution',
        'Intelligence',
        'Sagesse',
        'Charisme'
      ]
    }
  },
  computed: {
    availableCaracteristiques() {
      return this.allCaracteristiques;
    }
  },
  methods: {
    generateSlug() {
      this.formData.slug = this.formData.nom
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    },
    async saveClasse() {
      try {
        const response = await fetch('http://localhost:3000/api/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création de la classe');
        }

        this.$emit('classe-added');
        this.resetForm();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la création de la classe');
      }
    },
    resetForm() {
      this.formData = {
        nom: '',
        slug: '',
        description: '',
        caracteristiques: ['', ''],
        image: ''
      };
    }
  }
}
</script>

<style scoped>
.classe-form {
  background: #18182a;
  border: 1px solid #2c6578;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: #c8aa6e;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  color: #c8aa6e;
  margin-bottom: 20px;
  border-bottom: 2px solid #2c6578;
  padding-bottom: 10px;
}

h3 {
  color: #c8aa6e;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #c8aa6e;
}

input, select, textarea {
  padding: 10px;
  border: 1px solid #2c6578;
  border-radius: 4px;
  background: #23233a;
  color: #fff;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.caracteristiques-section {
  margin-top: 20px;
}

.caracteristiques-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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

@media (max-width: 768px) {
  .caracteristiques-grid {
    grid-template-columns: 1fr;
  }
}
</style> 