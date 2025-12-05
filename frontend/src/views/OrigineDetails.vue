<!--
  Ce composant affiche les détails d'une origine spécifique.
  Il permet de modifier les informations via un éditeur de texte riche (Quill).
-->

<template>
    <div class="origine-details-container">
      
      <!-- En-tête avec Titre et Bouton Modifier (Positionné comme demandé) -->
      <div class="header-section">
        <h1>{{ origin ? origin.nom : 'Détails de l\'origine' }}</h1>
        <div class="action-buttons" v-if="!loading">
          <button class="btn-edit" @click="toggleForm">
            {{ showForm ? 'Annuler' : (origin ? 'Modifier les informations' : 'Ajouter des informations') }}
          </button>
        </div>
      </div>

      <!-- Message si l'origine n'existe pas encore -->
      <div v-if="!origin && !loading && !showForm" class="no-origin-message">
        <h2>Cette origine n'existe pas encore dans la base de données</h2>
        <p>Slug : <strong>{{ slug }}</strong></p>
        <p>Cliquez sur "Ajouter des informations" en haut à droite pour commencer.</p>
      </div>

      <!-- Affichage des détails (Mode Lecture) -->
      <div v-if="!showForm && origin">
         <OrigineTemplate :origin="origin" />
      </div>
      
      <!-- Formulaire d'édition (Mode Édition) -->
      <div v-if="showForm" class="form-container">
        <h2>{{ origin ? 'Modifier l\'origine' : 'Créer l\'origine' }}</h2>
        <form @submit.prevent="submitForm">
          
          <!-- Champ Nom -->
          <div class="form-group">
            <label for="nom">Nom de la région / Origine :</label>
            <input 
              type="text" 
              id="nom" 
              v-model="formData.nom" 
              placeholder="Ex: Bilgewater"
              required
            />
          </div>
          
          <hr />
          <h3>Contenu Détaillé</h3>
          <p class="info-text">Utilisez les outils de mise en forme (Gras, Italique, Souligné, Couleurs) pour enrichir le contenu.</p>

          <!-- Nouveaux Champs Texte Riche -->
          
          <div class="form-group">
            <label>Thèmes majeurs :</label>
            <QuillEditor theme="snow" v-model:content="formData.themes_majeurs" contentType="html" :toolbar="toolbarOptions" />
          </div>

          <div class="form-group">
            <label>Géographie et lieux importants :</label>
            <QuillEditor theme="snow" v-model:content="formData.geographie" contentType="html" :toolbar="toolbarOptions" />
          </div>

          <div class="form-group">
            <label>Histoire résumée :</label>
            <QuillEditor theme="snow" v-model:content="formData.histoire" contentType="html" :toolbar="toolbarOptions" />
          </div>

          <div class="form-group">
            <label>Factions / Organisations :</label>
            <QuillEditor theme="snow" v-model:content="formData.factions" contentType="html" :toolbar="toolbarOptions" />
          </div>

          <div class="form-group">
            <label>Champions associés :</label>
            <QuillEditor theme="snow" v-model:content="formData.champions" contentType="html" :toolbar="toolbarOptions" />
          </div>

          <div class="form-group">
            <label>Evènements majeurs :</label>
            <QuillEditor theme="snow" v-model:content="formData.evenements" contentType="html" :toolbar="toolbarOptions" />
          </div>
          
           <!-- Position sur la carte (Déplacé à la fin) -->
           <div class="form-group-inline">
            <div class="form-group">
              <label>Position X (%) :</label>
              <input type="number" v-model.number="formData.position_x" min="0" max="100" step="0.1">
            </div>
            <div class="form-group">
              <label>Position Y (%) :</label>
              <input type="number" v-model.number="formData.position_y" min="0" max="100" step="0.1">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="toggleForm">Annuler</button>
            <button type="submit" class="submit-btn">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import OrigineTemplate from "../components/OrigineTemplate.vue";
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  
  export default {
    name: "OrigineDetails",
    components: {
      OrigineTemplate,
      QuillEditor
    },
    data() {
      return {
        origin: null,
        loading: true,
        slug: '',
        showForm: false,
        // Options de la barre d'outils Quill
        toolbarOptions: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'header': [1, 2, 3, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']                                         // remove formatting button
        ],
        formData: {
          nom: '',
          position_x: 5,
          position_y: 5,
          themes_majeurs: '',
          geographie: '',
          histoire: '',
          factions: '',
          champions: '',
          evenements: ''
        }
      };
    },
    created() {
      this.loadOrigin();
    },
    methods: {
      toggleForm() {
          this.showForm = !this.showForm;
          // Si on ouvre le formulaire, on recharge les données actuelles dans formData pour être sûr
          if (this.showForm && this.origin) {
              this.populateFormData(this.origin);
          }
      },
      populateFormData(data) {
        this.formData.nom = data.nom || '';
        this.formData.position_x = data.position_x !== undefined ? data.position_x : 5;
        this.formData.position_y = data.position_y !== undefined ? data.position_y : 5;
        
        // Nouveaux champs riches
        this.formData.themes_majeurs = data.themes_majeurs || '';
        this.formData.geographie = data.geographie || '';
        this.formData.histoire = data.histoire || '';
        this.formData.factions = data.factions || '';
        this.formData.champions = data.champions || '';
        this.formData.evenements = data.evenements || '';
      },
      loadOrigin() {
        const slug = this.$route.params.slug;
        this.slug = slug;
        this.loading = true;
    
        fetch(`http://localhost:3000/api/origins/${slug}`)
          .then((response) => {
            if (!response.ok) {
              if (response.status === 404) {
                this.origin = null;
                this.loading = false;
                // Si pas d'origine, on prépare le form avec les valeurs par défaut
                this.showForm = true; 
                return null;
              }
              throw new Error("Erreur lors de la récupération");
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              this.origin = data;
              this.populateFormData(data);
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
        
        const dataToSend = {
          slug: slug,
          nom: this.formData.nom,
          position_x: this.formData.position_x,
          position_y: this.formData.position_y,
          // Nouveaux champs
          themes_majeurs: this.formData.themes_majeurs,
          geographie: this.formData.geographie,
          histoire: this.formData.histoire,
          factions: this.formData.factions,
          champions: this.formData.champions,
          evenements: this.formData.evenements
        };
        
        const method = this.origin ? 'PUT' : 'POST';
        const url = this.origin 
          ? `http://localhost:3000/api/origins/${slug}` 
          : `http://localhost:3000/api/origins`;
        
        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        })
          .then((response) => {
            if (!response.ok) throw new Error("Erreur sauvegarde");
            return response.json();
          })
          .then((data) => {
            this.origin = data;
            this.showForm = false;
          })
          .catch((error) => {
            console.error("Erreur:", error);
            alert('Erreur lors de la sauvegarde');
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .origine-details-container {
    padding: 20px;
  }
  
  /* Header Section style (Copied/Adapted from CompetenceList) */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 2px solid #c8aa6e;
    padding-bottom: 10px;
  }
  
  .header-section h1 {
      color: #c8aa6e;
      margin: 0;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .btn-edit {
    background-color: #2c6578;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .btn-edit:hover {
    background-color: #1e4a5a;
  }

  /* Form Styles */
  .form-container {
    background-color: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
  }
  
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .form-group-inline {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
  }
  .form-group-inline .form-group {
      flex: 1;
      margin-bottom: 0;
  }

  .info-text {
      color: #666;
      font-style: italic;
      margin-bottom: 15px;
  }

  .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
  }

  .btn-cancel {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .submit-btn:hover {
    background-color: #218838;
  }
  
  .no-origin-message {
    background: #fff3cd;
    padding: 20px;
    border-radius: 5px;
    color: #856404;
    border: 1px solid #ffeeba;
  }
  </style>