<!--
  Ce composant affiche la page d'accueil de l'univers Runeterra.
  Il affiche le titre, le contenu et les liens vers les pages Outils, Journal et Musique.
-->

<template>
  <div>
    <h1>Runeterra</h1>
    <p>Page d'accueil de l'univers Runeterra.</p>
    
    <!-- Bouton pour ajouter une origine -->
    <button @click="showAddOriginForm = !showAddOriginForm" class="add-origin-btn">
      {{ showAddOriginForm ? 'Annuler' : 'Ajouter une origine' }}
    </button>
    
    <!-- Formulaire pour ajouter une nouvelle origine -->
    <div v-if="showAddOriginForm" class="form-container">
      <h2>Créer une nouvelle origine</h2>
      <form @submit.prevent="createOrigin">
        <div class="form-group">
          <label for="nom">Nom de l'origine :</label>
          <input 
            type="text" 
            id="nom" 
            v-model="newOriginName" 
            placeholder="Entrez le nom de l'origine..."
            required
          />
        </div>
        
        <button type="submit" class="submit-btn">Créer</button>
      </form>
    </div>
    
    <br>
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
  data() {
    return {
      showAddOriginForm: false,
      newOriginName: ''
    };
  },
  methods: {
    // Fonction pour générer un slug à partir du nom
    generateSlug(name) {
      return name
        .toLowerCase()
        .normalize('NFD') // Normalise les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ''); // Supprime les tirets au début et à la fin
    },
    
    createOrigin() {
      const slug = this.generateSlug(this.newOriginName);
      
      // Créer l'origine avec seulement le nom et le slug
      const newOrigin = {
        slug: slug,
        nom: this.newOriginName,
        description: '', // Vide pour l'instant
        traits: [], // Vide pour l'instant
        regions_associees: [] // Vide pour l'instant
      };
      
      // Envoyer à l'API
      fetch('http://localhost:3000/api/origins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrigin)
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 409) {
              throw new Error('Une origine avec ce nom existe déjà');
            }
            throw new Error("Erreur lors de la création de l'origine");
          }
          return response.json();
        })
        .then((data) => {
          alert(`Origine "${data.nom}" créée avec succès !`);
          this.showAddOriginForm = false;
          this.newOriginName = '';
          // Rediriger vers la page de l'origine pour compléter les informations
          this.$router.push({ name: 'OrigineDetails', params: { slug: data.slug } });
        })
        .catch((error) => {
          console.error("Erreur:", error);
          alert(error.message || 'Erreur lors de la création de l\'origine');
        });
    }
  }
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

.add-origin-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px 0;
  font-weight: bold;
}

.add-origin-btn:hover {
  background-color: #45a049;
}

.form-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  max-width: 500px;
}

.form-container h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.submit-btn {
  background-color: #008CBA;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #007399;
}
</style>