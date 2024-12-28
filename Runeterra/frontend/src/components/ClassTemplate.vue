<template>
  <div>
    <!-- Titre principal -->
    <h1>{{ classe.nom }}</h1>
    <!-- Description de la classe -->
    <p>{{ classe.description }}</p>

    <!-- Liste des caractéristiques -->
    <h3>Caractéristiques :</h3>
    <ul>
      <li v-for="caracteristique in classe.caracteristiques" :key="caracteristique">
        {{ caracteristique }}
      </li>
    </ul>

    <!-- Image associée à la classe -->
    <img :src="classe.image" alt="Image de la classe" v-if="classe.image" />

    <!-- Liste des voies associées -->
    <div v-if="voies.length">
      <h3>Voies associées :</h3>
      <ul>
        <li v-for="voie in voies" :key="voie.slug">
          <!-- Nom et description de la voie -->
          <h4>{{ voie.nom }}</h4>
          <p>{{ voie.description }}</p>

          <!-- Compétences associées à la voie -->
          <div v-if="voie.competences && voie.competences.length > 0">
            <h5>Compétences :</h5>
            <ul>
              <!-- Affichage des détails de chaque compétence -->
              <li v-for="competence in voie.competences" :key="competence.slug">
                <strong>{{ competence.nom }}</strong> (Niveau : {{ competence.niveau }})
                <p>{{ competence.description }}</p>
                <!-- Dégâts de la compétence -->
                <p v-if="competence.degats"><strong>Dégâts :</strong> {{ competence.degats }}</p>
                <!-- Effets sur les alliés -->
                <p v-if="competence.allie"><strong>Effets sur alliés :</strong> {{ competence.allie }}</p>
                <!-- Effets sur les ennemis -->
                <p v-if="competence.ennemi"><strong>Effets sur ennemis :</strong> {{ competence.ennemi }}</p>
                <!-- Sauvegardes nécessaires -->
                <p v-if="competence.sauvegarde"><strong>Sauvegarde :</strong> {{ competence.sauvegarde }}</p>
                <!-- Portée de la compétence -->
                <p v-if="competence.portee"><strong>Portée :</strong> {{ competence.portee }}</p>
                <!-- Durée de la compétence -->
                <p v-if="competence.duree"><strong>Durée :</strong> {{ competence.duree }}</p>
              </li>
            </ul>
          </div>
          <!-- Message si aucune compétence n'est associée -->
          <p v-else>Aucune compétence associée à cette voie.</p>
        </li>
      </ul>
    </div>

    <!-- Message si aucune voie n'est associée -->
    <p v-else>Aucune voie associée à cette classe.</p>
  </div>
</template>

<script>
export default {
  name: "ClassTemplate", // Nom du composant
  props: {
    classe: { type: Object, required: true }, // Données de la classe (propriété obligatoire)
    voies: { type: Array, required: true }, // Liste des voies associées (propriété obligatoire)
  },
  async mounted() {
    // Récupérer les compétences pour chaque voie associée
    const promises = this.voies.map((voie) =>
      // Effectue un appel à l'API pour récupérer les compétences liées à une voie
      fetch(`http://localhost:3000/api/competences/${voie.slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des compétences pour la voie : ${voie.slug}`);
          }
          return response.json(); // Convertit la réponse en JSON
        })
        .then((data) => {
          voie.competences = data; // Ajoute les compétences à l'objet voie
        })
        .catch((error) => {
          console.error("Erreur :", error); // Log des erreurs en cas de problème
          voie.competences = []; // Définit un tableau vide si l'API échoue
        })
    );

    await Promise.all(promises); // Attend la récupération des compétences pour toutes les voies
  },
};
</script>

<style scoped>
/* Style des titres */
h1, h3, h4, h5 {
  color: #333;
}

/* Style des listes */
ul {
  list-style-type: none;
  padding: 0;
}

/* Style des éléments de liste */
li {
  margin: 10px 0;
}

/* Style des images */
img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>
