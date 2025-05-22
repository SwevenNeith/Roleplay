<template>
    <div>
        <!-- Titre principal de la page -->
        <h1>Journal</h1>
        <!-- Description de la page -->
        <p>Page d'accueil du journal.</p>

        <!-- Bouton pour afficher le formulaire d'ajout de session -->
        <button @click="showForm = true">Ajouter une session</button>

        <!-- Formulaire d'ajout de session, affiché uniquement si showForm est vrai -->
        <div v-if="showForm" class="form-container">
            <!-- Champ de texte pour le titre de la session -->
            <input 
                type="text" 
                v-model="sessionTitle" 
                placeholder="Titre" 
                class="form-input"
            />
            <!-- Zone de texte pour le contenu de la session -->
            <textarea 
                v-model="sessionContent" 
                placeholder="Commencer à écrire la session" 
                class="form-textarea"
            ></textarea>
            <!-- Bouton pour annuler et fermer le formulaire -->
            <button @click="cancelForm" class="form-button cancel-button">Annuler</button>
            <!-- Bouton pour sauvegarder la session -->
            <button @click="saveSession" class="form-button save-button">Sauvegarder</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Variable pour contrôler l'affichage du formulaire
            showForm: false,
            // Variable pour stocker le titre de la session
            sessionTitle: '',
            // Variable pour stocker le contenu de la session
            sessionContent: ''
        };
    },
    methods: {
        // Méthode pour annuler et fermer le formulaire
        cancelForm() {
            this.showForm = false; // Masquer le formulaire
            this.sessionTitle = ''; // Réinitialiser le titre
            this.sessionContent = ''; // Réinitialiser le contenu
        },
        // Méthode pour sauvegarder la session
        saveSession() {
            alert('Session enregistrée'); // Afficher un message de confirmation
            this.showForm = false; // Masquer le formulaire
            this.sessionTitle = ''; // Réinitialiser le titre
            this.sessionContent = ''; // Réinitialiser le contenu
        }
    }
};
</script>

<style scoped>
/* Conteneur du formulaire, centré horizontalement */
.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

/* Style pour les champs de texte */
.form-input, .form-textarea {
    width: 80%; /* Largeur identique pour les deux champs */
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style pour la zone de texte */
.form-textarea {
    height: 150px; /* Hauteur de la zone de texte */
    resize: none; /* Désactiver le redimensionnement */
}

/* Style pour les boutons */
.form-button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* Bouton Annuler */
.cancel-button {
    background-color: #f44336; /* Rouge */
    color: white;
}

/* Bouton Sauvegarder */
.save-button {
    background-color: #4CAF50; /* Vert */
    color: white;
}
</style>