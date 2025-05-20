<template>
  <div>
    <!-- Titre principal de la page -->
    <h1>Outils</h1>
    <!-- Description de la page -->
    <p>Voici les différents outils qui pourraient m'être utiles</p>
    <!-- Affichage du compteur -->
    <div class="counter-section">
      <!-- Affiche la valeur actuelle du compteur -->
      <span>Compteur : {{ counter }}</span>
      <!-- Bouton pour incrémenter le compteur -->
      <button @click="incrementCounter">Incrémenter</button>
      <!-- Bouton pour sauvegarder la valeur du compteur dans la base de données (affiché seulement si counter > 0) -->
      <button v-if="counter > 0" @click="saveCounter">Sauvegarder</button>
      <!-- Bouton pour réinitialiser le compteur -->
      <button @click="resetCounter">Réinitialiser</button>
    </div>
    <!-- Message de confirmation de sauvegarde -->
    <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>
  </div>
</template>

<script>
// Importer axios pour les requêtes HTTP
import axios from 'axios';

export default {
  name: 'Outils',
  data() {
    return {
      // Valeur initiale du compteur (sera remplacée par la valeur du localStorage si elle existe)
      counter: 0,
      // Message de confirmation après la sauvegarde
      saveMessage: '',
    };
  },
  mounted() {
    // Au montage du composant, on vérifie si une valeur existe dans le localStorage
    const savedCounter = localStorage.getItem('outils-counter');
    if (savedCounter !== null) {
      this.counter = parseInt(savedCounter, 10);
    }
  },
  methods: {
    // Méthode pour incrémenter le compteur de 1 à chaque clic
    incrementCounter() {
      this.counter += 1;
      localStorage.setItem('outils-counter', this.counter);
    },
    // Méthode pour réinitialiser le compteur à 0
    resetCounter() {
      this.counter = 0;
      localStorage.setItem('outils-counter', this.counter);
    },
    // Méthode pour sauvegarder la valeur du compteur dans la base de données
    async saveCounter() {
      try {
        // Utilise l'URL complète si tu n'as pas de proxy
        await axios.post('http://localhost:3000/api/counter', { value: this.counter });
        this.saveMessage = 'Compteur sauvegardé !';
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      } catch (error) {
        this.saveMessage = "Erreur lors de la sauvegarde";
        setTimeout(() => { this.saveMessage = ''; }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.content {
  margin-top: 60px;
  padding: 20px;
}
/* Style pour la section du compteur */
.counter-section {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}
.save-message {
  margin-top: 15px;
  color: #2c6578;
  font-weight: bold;
}
.tools-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 1.1em;
  color: #2c6578;
  text-decoration: underline;
  cursor: pointer;
}
.tools-link:hover {
  color: #c8aa6e;
}
</style>