<template>
    <div class="fullscreen-map">
      <div class="map-container">
        <!-- Image de la carte -->
        <img
          src="../assets/Runeterra_Map.png"
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
  html, body, #app, .fullscreen-map {
    height: 100%;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .fullscreen-map {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: #eee;
    z-index: 1;
  }
  
  .map-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    text-align: center;
    overflow: hidden;
  }
  
  .map-image {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 40px);
    object-fit: cover;
    border: none;
    margin: 0;
    padding: 0;
    z-index: 2;
  }
  
  .clickable-zone {
    position: absolute;
    cursor: pointer;
    z-index: 3;
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
  