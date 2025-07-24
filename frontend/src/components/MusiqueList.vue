<!--
  Ce composant affiche la liste des musiques groupées par thème.
  Il permet de sélectionner un thème et de voir les musiques associées.
  Il permet d'éditer une musique.
  Il permet de supprimer une musique.
-->

<template>
  <div class="musique-list">
    <!-- Grille des thèmes disponibles -->
    <div class="themes-grid">
      <div 
        v-for="theme in themes" 
        :key="theme"
        class="theme-card"
        @click="toggleTheme(theme)"
        :class="{ active: selectedTheme === theme }"
      >
        {{ theme }}
      </div>
    </div>

    <!-- Conteneur des musiques du thème sélectionné -->
    <div v-if="selectedTheme" class="musiques-container">
      <div class="musiques-list">
        <!-- Boucle sur chaque musique du thème -->
        <div v-for="musique in musiquesByTheme" :key="musique._id" class="musique-item">
          <!-- Mode affichage de la musique -->
          <div v-if="!editingMusic || editingMusic._id !== musique._id">
            <h3>{{ musique.titre }}</h3>
            <p>Artiste: {{ musique.artiste }}</p>
            <!-- Lien vers YouTube dans un nouvel onglet -->
            <a :href="musique.youtubeLink" target="_blank" rel="noopener noreferrer">
              Voir sur YouTube
            </a>
            <!-- Boutons d'action -->
            <div class="button-group">
              <button class="btn-edit" @click="startEdit(musique)">Modifier</button>
              <button class="btn-delete" @click="deleteMusique(musique._id)">Supprimer</button>
            </div>
          </div>

          <!-- Mode édition de la musique -->
          <div v-else class="edit-form">
            <!-- Formulaire d'édition -->
            <div class="form-group">
              <label>Titre:</label>
              <input v-model="editingMusic.titre" type="text" required>
            </div>
            <div class="form-group">
              <label>Artiste:</label>
              <input v-model="editingMusic.artiste" type="text" required>
            </div>
            <div class="form-group">
              <label>Thème:</label>
              <input v-model="editingMusic.theme" type="text" required>
            </div>
            <div class="form-group">
              <label>Lien YouTube:</label>
              <input v-model="editingMusic.youtubeLink" type="url" required>
            </div>
            <!-- Boutons de sauvegarde/annulation -->
            <div class="button-group">
              <button class="btn-save" @click="saveEdit">Enregistrer</button>
              <button class="btn-cancel" @click="cancelEdit">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusiqueList',
  // État local du composant
  data() {
    return {
      musiques: [],          // Liste de toutes les musiques
      selectedTheme: null,   // Thème actuellement sélectionné
      editingMusic: null     // Musique en cours d'édition
    }
  },
  // Propriétés calculées
  computed: {
    // Extrait la liste unique des thèmes
    themes() {
      return [...new Set(this.musiques.map(m => m.theme))];
    },
    // Filtre les musiques par thème sélectionné
    musiquesByTheme() {
      return this.musiques.filter(m => m.theme === this.selectedTheme);
    }
  },
  // Méthodes du composant
  methods: {
    // Récupère toutes les musiques depuis l'API
    async fetchMusiques() {
      try {
        const response = await fetch('http://localhost:3000/api/musiques');
        if (response.ok) {
          this.musiques = await response.json();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des musiques:', error);
      }
    },
    // Bascule la sélection d'un thème
    toggleTheme(theme) {
      this.selectedTheme = this.selectedTheme === theme ? null : theme;
    },
    // Active le mode édition pour une musique
    startEdit(musique) {
      this.editingMusic = { ...musique };
    },
    // Annule l'édition en cours
    cancelEdit() {
      this.editingMusic = null;
    },
    // Sauvegarde les modifications d'une musique
    async saveEdit() {
      try {
        const response = await fetch(`http://localhost:3000/api/musiques/${this.editingMusic._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editingMusic)
        });

        if (response.ok) {
          await this.fetchMusiques();
          this.editingMusic = null;
        }
      } catch (error) {
        console.error('Erreur lors de la modification de la musique:', error);
      }
    },
    // Supprime une musique
    async deleteMusique(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette musique ?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/musiques/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await this.fetchMusiques();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la musique:', error);
        }
      }
    }
  },
  // Hook de cycle de vie : chargement initial des données
  mounted() {
    this.fetchMusiques();
  }
}
</script>

<style scoped>
/* Style du conteneur principal */
.musique-list {
  padding: 20px;
}

/* Grille des thèmes */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

/* Style des cartes de thème */
.theme-card {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Effets de survol et état actif des cartes */
.theme-card:hover {
  background-color: #e0e0e0;
}

.theme-card.active {
  background-color: #4CAF50;
  color: white;
}

/* Conteneur des musiques */
.musiques-container {
  margin-top: 20px;
}

/* Grille responsive des musiques */
.musiques-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* Style des cartes de musique */
.musique-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.musique-item h3 {
  margin: 0 0 10px 0;
}

/* Style des liens YouTube */
.musique-item a {
  color: #4CAF50;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
}

.musique-item a:hover {
  text-decoration: underline;
}

/* Style des groupes de boutons */
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* Styles communs des boutons */
.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

/* Styles spécifiques des boutons */
.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #9e9e9e;
  color: white;
}

/* Style du formulaire d'édition */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Style des groupes de champs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Effets de survol des boutons */
.btn-edit:hover { background-color: #1976D2; }
.btn-delete:hover { background-color: #D32F2F; }
.btn-save:hover { background-color: #388E3C; }
.btn-cancel:hover { background-color: #757575; }
</style> 