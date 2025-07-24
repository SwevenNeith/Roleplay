<!--
  Ce composant affiche la page d'accueil de l'univers Runeterra.
  Il affiche le titre, le contenu et les liens vers les pages Outils, Journal et Musique.
-->

<template>
  <div>
    <h1>Runeterra</h1>
    <p>Page d'accueil de l'univers Runeterra.</p>
    <router-link to="/runeterra-outils" class="link">Outils</router-link>
    <br>
    <router-link to="/runeterra-journal" class="link">Journal</router-link>
    <br>
    <router-link to="/runeterra-musique" class="link">Musique</router-link>
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
.link {
  display: inline-block;
  margin-top: 20px;
  font-size: 1.1em;
  color: #2c6578;
  text-decoration: underline;
  cursor: pointer;
}
.link:hover {
  color: #c8aa6e;
}
</style>