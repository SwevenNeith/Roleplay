<!--
  Ce composant affiche les détails d'une origine spécifique.
  Il affiche le nom, la description, les traits et les régions associées à l'origine.
-->

<template>
    <div class="origine-details-container">
      <!-- Message si l'origine n'existe pas encore -->
      <div v-if="!origin && !loading" class="no-origin-message">
        <h2>Cette origine n'existe pas encore dans la base de données</h2>
        <p>Slug : <strong>{{ slug }}</strong></p>
        <p>Cliquez sur le bouton ci-dessous pour ajouter des informations.</p>
      </div>

      <!-- Affichage des détails de l'origine via le composant OrigineTemplate -->
      <OrigineTemplate :origin="origin" v-if="origin" />
      
      <!-- Bouton pour afficher le formulaire (visible même si origin n'existe pas) -->
      <button @click="showForm = !showForm" class="add-info-btn" v-if="!loading">
        {{ showForm ? 'Annuler' : 'Ajouter des informations' }}
      </button>
      
      <!-- Formulaire pour ajouter des informations -->
      <div v-if="showForm" class="form-container">
        <h2>{{ origin ? 'Modifier les informations' : 'Créer une nouvelle origine' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group" v-if="!origin">
            <label for="nom">Nom :</label>
            <input 
              type="text" 
              id="nom" 
              v-model="formData.nom" 
              placeholder="Entrez le nom de l'origine..."
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description :</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="5"
              placeholder="Entrez la description..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="traits">Traits :</label>
            <input 
              type="text" 
              id="traits" 
              v-model="formData.traits" 
              placeholder="Entrez les traits séparés par des virgules..."
            />
          </div>
          
          <div class="form-group">
            <label for="regions">Régions associées :</label>
            <input 
              type="text" 
              id="regions" 
              v-model="formData.regions_associees" 
              placeholder="Entrez les régions séparées par des virgules..."
            />
          </div>
          
          <div class="form-group-inline">
            <div class="form-group">
              <label for="position_x">Position X (% de gauche à droite) :</label>
              <input 
                type="number" 
                id="position_x" 
                v-model.number="formData.position_x" 
                placeholder="0-100 (ex: 0=gauche, 50=centre, 100=droite)"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div class="form-group">
              <label for="position_y">Position Y (% de haut en bas) :</label>
              <input 
                type="number" 
                id="position_y" 
                v-model.number="formData.position_y" 
                placeholder="0-100 (ex: 0=haut, 50=centre, 100=bas)"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
          
          <button type="submit" class="submit-btn">Valider</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import OrigineTemplate from "../components/OrigineTemplate.vue";
  
  export default {
    name: "OrigineDetails", // Nom du composant
    components: {
      OrigineTemplate, // Importation du composant OrigineTemplate
    },
    data() {
      return {
        origin: null, // L'origine sélectionnée
        loading: true, // État de chargement
        slug: '', // Slug de l'origine
        showForm: false, // Affichage du formulaire
        formData: {
          nom: '',
          description: '',
          traits: '',
          regions_associees: '',
          position_x: 50,
          position_y: 50
        }
      };
    },
    created() {
      this.loadOrigin();
    },
    methods: {
      loadOrigin() {
        // Récupère le slug de l'origine depuis l'URL
        const slug = this.$route.params.slug;
        this.slug = slug;
        this.loading = true;
    
        // Appel à l'API pour récupérer les données de l'origine en fonction du slug
        fetch(`http://localhost:3000/api/origins/${slug}`)
          .then((response) => {
            if (!response.ok) {
              if (response.status === 404) {
                // L'origine n'existe pas encore, ce n'est pas une erreur
                this.origin = null;
                this.loading = false;
                return null;
              }
              throw new Error("Erreur lors de la récupération des détails de l'origine");
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              this.origin = data; // Stocke les données de l'origine récupérées
              // Pré-remplir le formulaire avec les données existantes
              this.formData.nom = data.nom || '';
              this.formData.description = data.description || '';
              this.formData.traits = data.traits ? data.traits.join(', ') : '';
              this.formData.regions_associees = data.regions_associees ? data.regions_associees.join(', ') : '';
              this.formData.position_x = data.position_x !== undefined ? data.position_x : 5;
              this.formData.position_y = data.position_y !== undefined ? data.position_y : 5;
            }
            this.loading = false;
          })
          .catch((error) => {
            console.error("Erreur:", error);
            this.loading = false;
          });
      },
      submitForm() {
        const slug = this.$route.params.slug;
        
        // Préparer les données pour l'envoi
        const dataToSend = {
          slug: slug,
          nom: this.formData.nom || this.origin?.nom,
          description: this.formData.description,
          traits: this.formData.traits.split(',').map(t => t.trim()).filter(t => t),
          regions_associees: this.formData.regions_associees.split(',').map(r => r.trim()).filter(r => r),
          position_x: this.formData.position_x,
          position_y: this.formData.position_y
        };
        
        // Choisir la méthode HTTP selon si l'origine existe ou non
        const method = this.origin ? 'PUT' : 'POST';
        const url = this.origin 
          ? `http://localhost:3000/api/origins/${slug}` 
          : `http://localhost:3000/api/origins`;
        
        // Envoyer les données à l'API
        fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la mise à jour de l'origine");
            }
            return response.json();
          })
          .then((data) => {
            // Mettre à jour l'affichage avec les nouvelles données
            this.origin = data;
            this.showForm = false; // Masquer le formulaire
          })
          .catch((error) => {
            console.error("Erreur:", error);
            alert('Erreur lors de la mise à jour des informations');
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .origine-details-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .no-origin-message {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .no-origin-message h2 {
    color: #856404;
    margin-top: 0;
  }

  .no-origin-message p {
    color: #856404;
    margin: 10px 0;
  }
  
  .add-info-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  
  .add-info-btn:hover {
    background-color: #45a049;
  }
  
  .form-container {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
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
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  .form-group textarea {
    resize: vertical;
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

  .form-group-inline {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-group-inline .form-group {
    flex: 1;
    margin-bottom: 0;
  }
  </style>