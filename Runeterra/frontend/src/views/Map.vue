<template>
    <div>
      <h1>Carte du Monde de Runeterra</h1>
      <div class="map-container">
        <!-- Image de la carte -->
        <img
          src="../assets/Shivani Sheet.png"
          alt="Carte du Monde de Runeterra"
          class="map-image"
        />
        <!-- Zones visibles (superposées sur l'image) -->
        <div class="clickable-zone" 
             v-for="(zone, index) in zones" 
             :key="index"
             :style="zone.style"
             @click="goToOrigin(zone.slug)">
          <!-- Zone visible (peut être stylisée comme tu veux) -->
          <div class="zone-tooltip">{{ zone.nom }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Map",
    data() {
      return {
        // Définition des zones cliquables avec leur position et style
        zones: [
          {
            nom: "Noblesse Demacienne",
            slug: "demacian-nobility",
            style: {
              position: "absolute",
              top: "50px", // Position de la zone (à ajuster selon les coordonnées)
              left: "50px", // Position de la zone (à ajuster selon les coordonnées)
              width: "100px", // Largeur de la zone (à ajuster selon les coordonnées)
              height: "100px", // Hauteur de la zone (à ajuster selon les coordonnées)
              backgroundColor: "rgba(255, 0, 0, 0.5)", // Couleur de la zone cliquable (rouge semi-transparent)
              border: "2px solid red", // Bordure de la zone
            },
          },
          {
            nom: "Noblesse Noxus",
            slug: "noxian-nobility",
            style: {
              position: "absolute",
              top: "250px", // Position de la zone (à ajuster selon les coordonnées)
              left: "50px", // Position de la zone (à ajuster selon les coordonnées)
              width: "100px", // Largeur de la zone (à ajuster selon les coordonnées)
              height: "100px", // Hauteur de la zone (à ajuster selon les coordonnées)
              backgroundColor: "rgba(255, 0, 0, 0.5)", // Couleur de la zone cliquable (rouge semi-transparent)
              border: "2px solid red", // Bordure de la zone
            },
          },
          // Ajoute d'autres zones ici
        ],
      };
    },
    methods: {
      goToOrigin(originSlug) {
        this.$router.push({ name: "OriginDetails", params: { slug: originSlug } });
      },
    },
  };
  </script>
  
  <style scoped>
  .map-container {
    position: relative;
    text-align: center;
  }
  
  .map-image {
    max-width: 100%;
    height: auto;
    border: 1px solid #000;
  }
  
  .clickable-zone {
    position: absolute;
    cursor: pointer;
    /* D'autres styles peuvent être ajoutés ici pour personnaliser les zones */
  }
  
  .zone-tooltip {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 12px;
    color: white;
    font-weight: bold;
  }
  </style>
  