<template>
  <div>
    <h1>Runeterra</h1>
    <p>Page d'accueil de l'univers Runeterra.</p>
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
</style>