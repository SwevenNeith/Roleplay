<template>
  <div id="app">
    <Header />
    <main class="content">
      <router-view /><!-- Affichage des vues en fonction des routes -->
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style>
/* Styles par défaut pour le contenu principal */
main.content {
  margin-top: 60px; /* Marge par rapport au header */
  padding: 20px; /* Padding global */
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Empêche les débordements horizontaux */
  background-color: #f9f9f9; /* Fond clair par défaut */
}

/* S'assurer que les marges et paddings sont désactivés pour certaines pages */
main {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>