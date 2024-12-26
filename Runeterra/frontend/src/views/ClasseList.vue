<template>
    <div>
        <!-- Titre principal de la page -->
        <h1>Liste des Classes</h1>
        <!-- Liste non ordonnée pour afficher les classes -->
        <ul>
            <!-- Boucle sur chaque classe dans "classes" pour créer un élément de liste -->
            <li v-for="classe in classes" :key="classe.slug">
            <!-- Lien dynamique vers la page d'accueil pour chaque classe -->
            <router-link :to="'/'">{{ classe.nom }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
  /* Importation de la bibliothèque Axios pour effectuer des requêtes HTTP */
import axios from 'axios';

export default {
    name: 'ClasseList', // Nom du composant (bonne pratique pour identifier les composants)
    
    /* Déclaration des données locales du composant */
    data() {
        return {
            classes: [], // Tableau pour stocker les données des classes récupérées depuis l'API
        };
    },
    
    /* Hook du cycle de vie - s'exécute lorsque le composant est monté */
    created() {
      // Requête HTTP GET pour récupérer les classes depuis le backend
        axios
        .get('http://localhost:3000/api/classes') // URL de l'API backend
        .then(response => {
            // Enregistre les données reçues dans le tableau "classes"
            this.classes = response.data;
        })
        .catch(error => {
            // Gestion des erreurs si la requête échoue
            console.error('Erreur lors de la récupération des classes:', error);
        });
    },
};
</script>

<style scoped>
  /* Style pour la liste non ordonnée */
ul {
    list-style-type: none; /* Supprime les puces */
    padding: 0; /* Enlève le padding par défaut */
}

  /* Style pour chaque élément de la liste */
li {
    margin: 10px 0; /* Ajoute un espace vertical entre les éléments */
}

  /* Style pour les liens */
a {
    text-decoration: none; /* Supprime le soulignement des liens */
    color: #42b983; /* Couleur des liens */
}

  /* Style au survol des liens */
a:hover {
    text-decoration: underline; /* Ajoute un soulignement au survol */
}
</style>
