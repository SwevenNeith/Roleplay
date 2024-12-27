<template>
    <div>
      <!-- Titre principal -->
      <h1>{{ classe.nom }}</h1>
      <!-- Description de la classe -->
      <p>{{ classe.description }}</p>
      <!-- Liste des caractéristiques -->
      <h3>Caractéristiques :</h3>
      <ul>
        <li v-for="caracteristique in classe.caracteristiques" :key="caracteristique">
          {{ caracteristique }}
        </li>
      </ul>
      <!-- Image associée à la classe -->
      <img :src="classe.image" alt="Image de la classe" v-if="classe.image" />
  
      <!-- Liste des voies associées -->
      <div v-if="voies.length">
        <h3>Voies associées :</h3>
        <ul>
          <li v-for="voie in voies" :key="voie.slug">
            <!-- Nom de la voie -->
            <h4>{{ voie.nom }}</h4>
            <!-- Description de la voie -->
            <p>{{ voie.description }}</p>
          </li>
        </ul>
      </div>
      <!-- Message si aucune voie n'est associée -->
      <p v-else>Aucune voie associée à cette classe.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "ClassTemplate", // Nom du composant
    props: {
      classe: { type: Object, required: true }, // Données de la classe (propriété obligatoire)
      voies: { type: Array, required: true }, // Liste des voies associées (propriété obligatoire)
    },
  };
  </script>
  
  <style scoped>
  h1, h3 {
    color: #333;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin: 5px 0;
  }
  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
  }
  </style>
  