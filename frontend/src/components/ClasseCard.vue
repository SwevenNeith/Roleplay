<template>
  <!-- Carte cliquable représentant une classe -->
  <div class="classe-card" @click="goToClasse">
    <!-- Nom de la classe -->
    <h2>{{ classe.nom }}</h2>
    <!-- Description courte de la classe (80 caractères max) -->
    <p v-if="classe.description">
      {{ classe.description.substring(0, 80) }}
      <span v-if="classe.description.length > 80">...</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ClasseCard', // Nom du composant
  props: {
    classe: {
      type: Object,
      required: true // La classe à afficher
    }
  },
  methods: {
    // Redirige vers la page de détails de la classe au clic
    goToClasse() {
      this.$router.push(`/runeterra-classes/${this.classe.slug}`);
    }
  }
};
</script>

<style scoped>
.classe-card {
  background: #18182a; /* Couleur de fond */
  color: #c8aa6e;      /* Couleur du texte */
  border: 1px solid #2c6578; /* Bordure */
  border-radius: 10px; /* Coins arrondis */
  padding: 18px 22px;  /* Espacement interne */
  margin: 10px;        /* Espacement externe */
  cursor: pointer;     /* Curseur main au survol */
  transition: box-shadow 0.2s; /* Animation d'ombre */
  box-shadow: 0 2px 8px rgba(44,101,120,0.08); /* Ombre légère */
}
.classe-card:hover {
  box-shadow: 0 4px 16px #2c6578; /* Ombre plus marquée au survol */
  background: #23233a;            /* Fond plus foncé au survol */
}
h2 {
  margin: 0 0 8px 0; /* Marge autour du titre */
  font-size: 1.3em;  /* Taille du titre */
}
p {
  margin: 0;         /* Pas de marge */
  color: #aaa;       /* Couleur du texte secondaire */
  font-size: 1em;    /* Taille du texte */
}
</style> 