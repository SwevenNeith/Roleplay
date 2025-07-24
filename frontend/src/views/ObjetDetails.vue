<template>
  <div v-if="objet">
    <h1>{{ objet.nom }}</h1>
    <p v-if="objet.description"><strong>Description :</strong> {{ objet.description }}</p>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
export default {
  name: 'ObjetDetails',
  data() {
    return {
      objet: null
    };
  },
  created() {
    this.fetchObjet();
  },
  methods: {
    async fetchObjet() {
      const slug = this.$route.params.slug;
      const res = await fetch(`http://localhost:3000/api/objets`);
      const objets = await res.json();
      this.objet = objets.find(o => o.slug === slug);
    }
  }
}
</script>

<style scoped>
h1 {
  color: #c8aa6e;
  margin-bottom: 18px;
}
p {
  margin: 8px 0;
  color: #eee;
  font-size: 1.08em;
}
strong {
  color: #c8aa6e;
}
</style>