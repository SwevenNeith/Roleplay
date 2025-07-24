<!--
  Ce composant affiche l'en-tête de la page.
  Il affiche le titre de la page.
-->

<template>
  <header class="simple-header">
    <h1>Accueil</h1>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style scoped>
.simple-header {
  background-color: #2c6578;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(200, 170, 110, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

.simple-header h1 {
  color: #c8aa6e;
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}
</style>