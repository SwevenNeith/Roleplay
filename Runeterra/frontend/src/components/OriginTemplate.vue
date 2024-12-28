<template>
    <div>
      <h1>{{ origin.nom }}</h1>
      <p><strong>Description :</strong> {{ origin.description }}</p>
      <h3>Traits :</h3>
      <ul>
        <li v-for="trait in origin.traits" :key="trait">{{ trait }}</li>
      </ul>
      <h3>Régions associées :</h3>
      <ul>
        <li v-for="region in origin.regions_associees" :key="region">{{ region }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "OriginTemplate", // Nom du composant
    props: {
      origin: { type: Object, required: true }, // L'origine (propriété obligatoire)
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
    margin: 5px 0;
  }
  </style>
  