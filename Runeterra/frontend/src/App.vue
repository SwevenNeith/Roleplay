<template>
  <div id="app">
    <!-- Use dynamic component for the header -->
    <component :is="currentHeader" />
    <main class="content">
      <router-view /><!-- Affichage des vues en fonction des routes -->
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import RuneterraHeader from './components/RuneterraHeader.vue';

export default {
  components: {
    Header,
    RuneterraHeader,
  },
  setup() {
    // Access the current route
    const route = useRoute();

    // Compute which header to use based on the route's path
    const currentHeader = computed(() => {
      // If the path contains "runeterra", use RuneterraHeader
      if (route.path.includes('runeterra')) {
        return 'RuneterraHeader';
      }
      // Otherwise, use the default Header
      return 'Header';
    });

    return { currentHeader };
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