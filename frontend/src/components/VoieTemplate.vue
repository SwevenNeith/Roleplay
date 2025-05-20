<template>
    <div>
      <!-- Affichage des informations principales de la voie -->
      <h1>{{ voie.nom }}</h1>
      <p><strong>Description :</strong> {{ voie.description }}</p>
  
      <!-- Liste des compétences associées -->
      <div v-if="competences.length">
        <h2>Compétences associées</h2>
        <ul>
          <li v-for="competence in competences" :key="competence.slug">
            <h3>{{ competence.nom }}</h3>
            <p><strong>Description :</strong> {{ competence.description }}</p>
            <p><strong>Niveau :</strong> {{ competence.niveau }}</p>
            <p v-if="competence.degats"><strong>Dégâts :</strong> {{ competence.degats }}</p>
            <p v-if="competence.allie"><strong>Effets sur les alliés :</strong> {{ competence.allie }}</p>
            <p v-if="competence.ennemi"><strong>Effets sur les ennemis :</strong> {{ competence.ennemi }}</p>
            <p v-if="competence.sauvegarde"><strong>Sauvegarde :</strong> {{ competence.sauvegarde }}</p>
            <p v-if="competence.portee"><strong>Portée :</strong> {{ competence.portee }}</p>
            <p v-if="competence.duree"><strong>Durée :</strong> {{ competence.duree }}</p>
          </li>
        </ul>
      </div>
      <p v-else>Aucune compétence associée.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VoieTemplate', // Nom du composant
    props: {
      voie: { type: Object, required: true }, // La voie à afficher
      competences: { type: Array, required: true }, // Les compétences associées
    },
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
    margin: 10px 0;
  }
  
  strong {
    font-weight: bold;
  }
  </style>
  