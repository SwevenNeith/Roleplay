<template>
  <div>
    <h1>Accueil</h1>
    <p>Bienvenue sur la page d'accueil.</p>
    <router-link to="/runeterra" class="runeterra-link">Runeterra</router-link>
  </div>
</template>

<style scoped>
.runeterra-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 1.2em;
  color: #2c6578;
  text-decoration: underline;
  cursor: pointer;
}
.runeterra-link:hover {
  color: #c8aa6e;
}
</style>
