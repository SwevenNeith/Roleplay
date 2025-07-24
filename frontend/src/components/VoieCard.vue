<!--
  Ce composant affiche une carte de voie.
  Il affiche le nom de la voie et le nom de la classe associée.
  Il redirige vers la page de détails de la voie lorsqu'on clique sur la carte.
-->

<template>
  <!-- Carte cliquable représentant une voie -->
  <div class="voie-card" @click="goToVoie">
    <!-- Nom de la voie -->
    <h2>{{ voie.nom }}</h2>
    <!-- Nom de la classe associée -->
    <p class="classe-name">Classe : {{ classeNom }}</p>
  </div>
</template>

<script>
export default {
  name: 'VoieCard', // Nom du composant
  props: {
    voie: { type: Object, required: true }, // Objet voie à afficher
    classeNom: { type: String, required: true } // Nom de la classe associée
  },
  methods: {
    // Redirige vers la page de détails de la voie au clic
    goToVoie() {
      this.$router.push(`/runeterra-voies/${this.voie.slug}`);
    }
  }
};
</script>

<style scoped>
.voie-card {
  background: #18182a; /* Couleur de fond */
  color: #c8aa6e; /* Couleur du texte */
  border: 1px solid #2c6578; /* Bordure */
  border-radius: 10px; /* Coins arrondis */
  padding: 18px 22px; /* Espacement interne */
  margin: 10px; /* Espacement externe */
  cursor: pointer; /* Curseur main au survol */
  transition: box-shadow 0.2s; /* Animation d'ombre */
  box-shadow: 0 2px 8px rgba(44,101,120,0.08); /* Ombre légère */
}
.voie-card:hover {
  box-shadow: 0 4px 16px #2c6578; /* Ombre plus marquée au survol */
  background: #23233a; /* Fond plus foncé au survol */
}
h2 {
  margin: 0 0 8px 0; /* Marge autour du titre */
  font-size: 1.2em; /* Taille du titre */
}
.classe-name {
  margin: 0; /* Pas de marge */
  color: #aaa; /* Couleur du texte secondaire */
  font-size: 1em; /* Taille du texte */
}
</style> 