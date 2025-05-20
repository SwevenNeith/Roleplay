<template>
    <div>
      <!-- Titre principal de la page -->
      <h1>Liste des Classes</h1>
      <!-- Affiche un lien pour chaque classe -->
      <ul>
        <li v-for="classe in classes" :key="classe.slug">
          <!-- Lien dynamique vers les détails de la classe -->
          <router-link :to="`/classes/${classe.slug}`">{{ classe.nom }}</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "ClassList", // Nom du composant
    data() {
      return {
        classes: [], // Liste des classes récupérées du backend
      };
    },
    created() {
      // Appelle le backend pour récupérer la liste des classes
      fetch("http://localhost:3000/api/classes")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des classes");
          }
          return response.json();
        })
        .then((data) => {
          this.classes = data; // Stocke les classes dans l'état local
        })
        .catch((error) => {
          console.error("Erreur:", error); // Log les erreurs éventuelles
        });
    },
  };
  </script>
  
  <style scoped>
  /* Style pour la liste */
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
  
  a {
    text-decoration: none;
    color: #007bff;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  