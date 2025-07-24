<template>
  <!-- Carte cliquable représentant un objet -->
  <div class="objet-card" @click="goToObjet">
    <h2>{{ objet.nom }}</h2>
    <p v-if="objet.description">
      {{ objet.description.substring(0, 80) }}
      <span v-if="objet.description.length > 80">...</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ObjetCard',
  props: {
    objet: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToObjet() {
      this.$router.push(`/runeterra-objet/${this.objet.slug}`);
    }
  }
}
</script>

<style scoped>
.objet-card {
  background: #18182a;
  color: #c8aa6e;
  border: 1px solid #2c6578;
  border-radius: 10px;
  padding: 18px 22px;
  margin: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(44,101,120,0.08);
}
.objet-card:hover {
  box-shadow: 0 4px 16px #2c6578;
  background: #23233a;
}
h2 {
  margin: 0 0 8px 0;
  font-size: 1.3em;
}
p {
  margin: 0;
  color: #aaa;
  font-size: 1em;
}
</style>