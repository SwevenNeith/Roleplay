<template>
  <div>
    <h1>Runeterra</h1>
    <p>Page d'accueil de l'univers Runeterra.</p>
    <router-link to="/runeterra-outils" class="outils-link">Outils</router-link>
  </div>
</template>

<script>
import RuneterraHeader from '../components/RuneterraHeader.vue';

export default {
  name: 'RuneterraHomePage',
  components: {
    RuneterraHeader,
  },
};
</script>

<style scoped>
.content {
  margin-top: 60px;
  padding: 20px;
}
.outils-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 1.1em;
  color: #2c6578;
  text-decoration: underline;
  cursor: pointer;
}
.outils-link:hover {
  color: #c8aa6e;
}
</style>