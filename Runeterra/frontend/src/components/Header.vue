// ======= src/components/Header.vue =======
<template>
  <header>
    <nav class="links">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/map" class="nav-link">Map</router-link>
      <!-- Menu déroulant -->
      <div class="dropdown">
        <router-link to="/" class="dropdown-link">Jeu</router-link>
        <!-- Menu déroulant qui s'affichera au survol -->
        <div class="dopdown-menu">
          <router-link to="/classes">Classes</router-link>
          <router-link to="/voies">Voies</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style scoped>
/* Styles pour le header */
header {
  background-color: #2c6578; /* Couleur de fond du header */
  padding: 15px; /* Largeur du header */
  position: fixed; /* Fixe le header en haut de la page */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* S'assurer qu'il est au-dessus du contenu */
  box-shadow: 0 2px 5px rgba(200, 170, 110, 255); /* Optionnel : ombre pour différencier le header */
}

/* Styles pour le container des liens */
.links {
  display: flex; /* Met les liens en ligne */
  justify-content: space-between; /* Espace entre les liens, un à gauche et un à droite */
  gap: 20px; /* Espace entre les liens */
  margin-left: 20px; /* Marge à gauche du container */
  padding-right: 135px; /* Ajoute un espace à droite */
  width: 100%; /* Assurer que les liens prennent toute la largeur disponible */
  box-sizing: border-box; /* Inclure les paddings et marges dans la largeur totale */
}

/* Styles pour chaque lien à droite*/
.nav-link {
  text-decoration: none; /* Retirer le soulignement */
  color: #c8aa6e; /* Couleur des liens */
  padding: 5px 10px; /* Espacement autour des liens */
  font-size: 16px;
}

.nav-link:hover {
  color: #c9bfa5; /* Change la couleur au survol */
}

/* Styles pour le menu déroulant */
.dropdown {
  position: relative; /* Position relative pour contenir le menu déroulant */
  display: flex; /* Alignement en ligne des éléments de la dropdown */
  align-items: center; /* Aligner le lien "Classe" et le menu déroulant sur la même ligne */
}

.dropdown-link {
  cursor: pointer; /* Le lien "Classe" sera cliquable */
  text-decoration: none; /* Retirer le soulignement */
  color: #c8aa6e; /* Couleur du lien "Classe" */
  padding: 5px 10px; /* Espacement autour du lien */
  font-size: 16px;
}

.dropdown-link:hover {
  color: #c9bfa5; /* Change la couleur au survol */
}

/* Styles pour le menu déroulant (caché par défaut) */
.dropdown-menu {
  display: none; /* Cache le menu déroulant par défaut */
  position: absolute; /* Positionne le menu sous le lien */
  top: 100%; /* Le menu s'affiche juste en dessous du lien */
  left: 0;
  background-color: #fff; /* Fond blanc */
  padding: 5px 10px; /* Réduire le padding pour rendre le menu plus compact */
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(12, 71, 85, 255); /* Ombre autour du menu */
  min-width: 50px; /* Réduire la largeur minimale du menu */ /*Jouer avec pour la largeur du menu déroulant*/
  font-size: 14px; /* Réduire la taille de la police */
}

/* Lien dans le menu déroulant */
.dropdown-menu a {
  color: #c8aa6e; /* Couleur du texte pour les liens */
  text-decoration: none; /* Retirer les soulignements des liens */
  display: block; /* Les liens dans le menu doivent être affichés comme des blocs */
  padding: 3px 0; /* Réduire l'espacement entre les liens */
}

.dropdown-menu a:hover {
  color: #c9bfa5; /* Changer la couleur au survol des liens */
}

/* Affiche le menu déroulant lorsque le lien "Classe" est survolé */
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>