<!--
  Ce composant affiche la carte du monde de Runeterra.
  Il affiche les zones cliquables et les redirige vers la page d'origine correspondante.
-->

<template>
    <div class="fullscreen-map">
      <!-- Conteneur principal qui définit la zone visible (viewport) -->
      <div class="map-viewport" ref="viewport">
        
        <!-- Conteneur du contenu (image + pins) qui est mis à l'échelle pour couvrir le viewport -->
        <div class="map-content" :style="mapContentStyle">
          
          <!-- Image de la carte -->
          <img
            ref="mapImage"
            src="../assets/Runeterra_Map.png"
            alt="Carte du Monde de Runeterra"
            class="map-image"
            @load="updateDimensions"
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
        
        <!-- Message si aucune origine n'existe -->
        <div v-if="zones.length === 0 && !loading" class="no-origins-message">
          <p>Aucune origine n'a été créée pour le moment.</p>
          <p>Allez sur la page <router-link to="/runeterra">Runeterra</router-link> pour en créer une.</p>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Map",
    data() {
      return {
        zones: [], // Les zones seront chargées depuis la BDD
        loading: true,
        mapDimensions: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        }
      };
    },
    computed: {
      mapContentStyle() {
        return {
          width: `${this.mapDimensions.width}px`,
          height: `${this.mapDimensions.height}px`,
          top: `${this.mapDimensions.top}px`,
          left: `${this.mapDimensions.left}px`,
          position: 'absolute'
        };
      }
    },
    created() {
      this.loadOrigins();
      window.addEventListener('resize', this.updateDimensions);
    },
    destroyed() {
      window.removeEventListener('resize', this.updateDimensions);
    },
    methods: {
      updateDimensions() {
        const viewport = this.$refs.viewport;
        const image = this.$refs.mapImage;
        
        if (!viewport || !image) return;
        
        // Dimensions du viewport (la zone disponible à l'écran)
        const viewWidth = viewport.clientWidth;
        const viewHeight = viewport.clientHeight;
        
        // Dimensions naturelles de l'image (pour le ratio)
        // Si l'image n'est pas encore chargée, on utilise des valeurs par défaut ou on attend
        const imgNatWidth = image.naturalWidth || 1920; 
        const imgNatHeight = image.naturalHeight || 1080;
        
        const viewRatio = viewWidth / viewHeight;
        const imgRatio = imgNatWidth / imgNatHeight;
        
        let mapWidth, mapHeight;
        
        // Logique "object-fit: cover" manuelle
        if (viewRatio > imgRatio) {
          // L'écran est plus large que l'image (ratio) -> on cale sur la largeur
          mapWidth = viewWidth;
          mapHeight = viewWidth / imgRatio;
        } else {
          // L'écran est plus haut que l'image (ratio) -> on cale sur la hauteur
          mapHeight = viewHeight;
          mapWidth = viewHeight * imgRatio;
        }
        
        // Centrage
        const top = (viewHeight - mapHeight) / 2;
        const left = (viewWidth - mapWidth) / 2;
        
        this.mapDimensions = { width: mapWidth, height: mapHeight, top, left };
      },
      
      loadOrigins() {
        // Charger toutes les origines depuis l'API
        fetch('http://localhost:3000/api/origins')
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la récupération des origines");
            }
            return response.json();
          })
          .then((origins) => {
            // Convertir les origines en zones cliquables
            // Utilise les positions stockées dans la BDD (en pourcentages pour être responsive)
            this.zones = origins.map((origin) => ({
              nom: origin.nom,
              slug: origin.slug,
              style: {
                position: "absolute",
                top: `${origin.position_y || 5}%`, // Position Y en pourcentage (0-100%)
                left: `${origin.position_x || 5}%`, // Position X en pourcentage (0-100%)
                width: "3.5vw", // Taille responsive
                height: "3.5vw", // Taille responsive
                minWidth: "20px", // Taille minimum pour petits écrans
                minHeight: "20px", // Taille minimum pour petits écrans
                maxWidth: "150px", // Taille maximum augmentée pour très grands écrans
                maxHeight: "150px", // Taille maximum augmentée pour très grands écrans
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                border: "2px solid red",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)", // Centre le cercle sur ses coordonnées
              }
            }));
            this.loading = false;
            // Mettre à jour les dimensions une fois les données chargées (au cas où)
            this.$nextTick(() => this.updateDimensions());
          })
          .catch((error) => {
            console.error("Erreur:", error);
            this.loading = false;
          });
      },
      goToOrigin(originSlug) {
        this.$router.push({ name: "OrigineDetails", params: { slug: originSlug } });
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
  
  .map-viewport {
    position: absolute;
    top: 40px; /* Laisse de la place pour le header si besoin, ou ajuster selon design */
    left: 0;
    width: 100vw;
    height: calc(100vh - 40px);
    overflow: hidden; /* Important : cache ce qui dépasse */
    background-color: #000; /* Fond noir si jamais */
  }
  
  .map-content {
    /* Les dimensions et positions sont gérées par JS */
    position: absolute;
  }
  
  .map-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill; /* L'image remplit le conteneur map-content qui a déjà le bon ratio */
  }
  
  .clickable-zone {
    position: absolute;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.2s ease; /* Animation au survol */
  }
  
  .zone-tooltip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.6vw; /* Taille de texte responsive */
    min-font-size: 8px;
    color: white;
    font-weight: bold;
    white-space: nowrap;
    pointer-events: none; /* Le tooltip ne bloque pas les clics */
  }
  
  .no-origins-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 10px;
    z-index: 4;
    text-align: center;
  }
  
  .no-origins-message p {
    margin: 10px 0;
    font-size: 16px;
    color: #333;
  }
  
  .no-origins-message a {
    color: #2c6578;
    text-decoration: underline;
    font-weight: bold;
  }
  
  .no-origins-message a:hover {
    color: #c8aa6e;
  }
  </style>