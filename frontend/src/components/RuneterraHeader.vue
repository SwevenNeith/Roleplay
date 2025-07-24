<!--
  Ce composant affiche l'en-tête de la page.
  Il affiche le titre de la page.
-->

<template>
  <header>
    <nav class="links">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/runeterra-map" class="nav-link">Map</router-link>
      <div class="dropdown">
        <router-link to="/runeterra" class="dropdown-link">Jeu</router-link>
        <div class="dropdown-menu">
          <router-link to="/runeterra-classes">Classes</router-link>
          <router-link to="/runeterra-voies">Voies</router-link>
          <router-link to="/runeterra-competences">Compétences</router-link>
          <router-link to="/runeterra-objets">Objets</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'RuneterraHeader',
};
</script>

<style scoped>
/* (Copy the styles from your current Header.vue here) */
header {
  background-color: #2c6578;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(200, 170, 110, 255);
}
.links {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-left: 20px;
  padding-right: 135px;
  width: 100%;
  box-sizing: border-box;
}
.nav-link {
  text-decoration: none;
  color: #c8aa6e;
  padding: 5px 10px;
  font-size: 16px;
}
.nav-link:hover {
  color: #c9bfa5;
}
.dropdown {
  position: relative;
  display: flex;
  align-items: center;
}
.dropdown-link {
  cursor: pointer;
  text-decoration: none;
  color: #c8aa6e;
  padding: 5px 10px;
  font-size: 16px;
}
.dropdown-link:hover {
  color: #c9bfa5;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  padding: 5px 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(12, 71, 85, 255);
  min-width: 50px;
  font-size: 14px;
}
.dropdown-menu a {
  color: #c8aa6e;
  text-decoration: none;
  display: block;
  padding: 3px 0;
}
.dropdown-menu a:hover {
  color: #c9bfa5;
}
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>