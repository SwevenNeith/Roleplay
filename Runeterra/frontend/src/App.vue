<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
// Importer Axios pour effectuer des requêtes HTTP
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      message: '',  // Le message reçu de l'API
    };
  },
  mounted() {
    // Lorsque le composant est monté, faire une requête GET vers le backend
    axios.get('http://localhost:3000/api/message')
      .then(response => {
        // Mettre à jour le message avec la réponse de l'API
        this.message = response.data.message;
      })
      .catch(error => {
        console.error('Erreur de requête API :', error);
      });
  },
};
</script>

<style>
/* Ajoutez du style pour le frontend si nécessaire */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
