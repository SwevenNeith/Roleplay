<!--
  Ce composant affiche les données d'une origine spécifique.
  Il affiche le contenu riche (HTML) généré par l'éditeur.
-->

<template>
    <div class="origin-template">
      
      <!-- Sections de contenu riche -->
      <div class="rich-content-section" v-if="origin.themes_majeurs">
         <h3>Thèmes majeurs</h3>
         <div class="ql-editor-content" v-html="origin.themes_majeurs"></div>
      </div>

      <div class="rich-content-section" v-if="origin.geographie">
         <h3>Géographie et lieux importants</h3>
         <div class="ql-editor-content" v-html="origin.geographie"></div>
      </div>

      <div class="rich-content-section" v-if="origin.histoire">
         <h3>Histoire résumée</h3>
         <div class="ql-editor-content" v-html="origin.histoire"></div>
      </div>

      <div class="rich-content-section" v-if="origin.factions">
         <h3>Factions / Organisations</h3>
         <div class="ql-editor-content" v-html="origin.factions"></div>
      </div>

      <div class="rich-content-section" v-if="origin.champions">
         <h3>Champions associés</h3>
         <div class="ql-editor-content" v-html="origin.champions"></div>
      </div>

      <div class="rich-content-section" v-if="origin.evenements">
         <h3>Evènements majeurs</h3>
         <div class="ql-editor-content" v-html="origin.evenements"></div>
      </div>

    </div>
  </template>
  
  <script>
  export default {
    name: "OrigineTemplate",
    props: {
      origin: { type: Object, required: true },
    },
  };
  </script>
  
  <style scoped>
  .origin-template {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .rich-content-section {
      margin-bottom: 30px;
  }

  .rich-content-section h3 {
      color: #c8aa6e; /* Couleur thème */
      border-bottom: 2px solid #eee;
      padding-bottom: 8px;
      margin-bottom: 15px;
  }

  /* Style pour le contenu HTML injecté via v-html */
  .ql-editor-content {
      line-height: 1.6;
      color: #333;
  }
  
  /* On s'assure que le style Quill par défaut est respecté si besoin, 
     mais v-html applique juste le HTML brut. 
     Les classes ql-align-center etc sont gérées par Quill. */
  :deep(.ql-align-center) { text-align: center; }
  :deep(.ql-align-right) { text-align: right; }
  :deep(.ql-align-justify) { text-align: justify; }
  :deep(strong) { font-weight: bold; }
  :deep(em) { font-style: italic; }
  :deep(u) { text-decoration: underline; }
  </style>