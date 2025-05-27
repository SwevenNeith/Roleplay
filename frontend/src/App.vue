<template>
  <div id="app" :data-theme="currentTheme">
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
import './assets/styles/runeterra-theme.css';

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

    const currentTheme = computed(() => {
      return route.path.includes('runeterra') ? 'runeterra' : 'default';
    });

    return { currentHeader, currentTheme };
  },
};
</script>

<style>
/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Styles par défaut pour le contenu principal */
main.content {
  flex: 1;
  padding: 20px;
  width: 100%;
}

/* Styles par défaut (non-Runeterra) */
[data-theme="default"] main.content {
  background-color: #f9f9f9;
  margin-top: 60px;
}
</style>