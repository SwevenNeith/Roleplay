<template>
    <div>
      <h1>Liste des Voies</h1>
      <!-- Liste les voies -->
      <ul>
        <li v-for="voie in voies" :key="voie.slug">
          <!-- Chaque voie est un lien affichant son nom -->
          <router-link :to="`/voies/${voie.slug}`">{{ voie.nom }}</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "VoieList", // Nom du composant
    data() {
      return {
        voies: [] // Tableau pour stocker les voies récupérées
      };
    },
    created() {
      // Appel à l'API pour récupérer les voies lorsque le composant est créé
      fetch("http://localhost:3000/api/voies")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des voies");
          }
          return response.json();
        })
        .then((data) => {
          this.voies = data; // Stocke les voies récupérées
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #333;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin: 5px 0;
  }
  </style>
  