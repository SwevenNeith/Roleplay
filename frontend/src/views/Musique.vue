<!-- Vue principale pour la gestion des musiques -->
<template>
    <div class="musique-page">
        <!-- En-tête de la page -->
        <h1>Musique</h1>
        <p>Une liste des musiques rangées par thèmes avec une banque de son</p>
        
        <!-- Bouton pour afficher/masquer le formulaire d'ajout -->
        <button 
            class="add-button" 
            @click="showForm = !showForm"
            v-text="showForm ? 'Fermer le formulaire' : 'Ajouter une musique'"
        />

        <!-- Formulaire d'ajout de musique (affiché conditionnellement) -->
        <MusiqueForm 
            v-if="showForm" 
            @musique-added="handleMusiqueAdded"
            @cancel="showForm = false"
        />

        <!-- Liste des musiques (composant principal) -->
        <MusiqueList ref="musiqueList" />
    </div>
</template>

<script>
// Import des composants nécessaires
import MusiqueForm from '@/components/MusiqueForm.vue'
import MusiqueList from '@/components/MusiqueList.vue'

export default {
    name: 'Musique',
    // Déclaration des composants utilisés
    components: {
        MusiqueForm,
        MusiqueList
    },
    // État local du composant
    data() {
        return {
            showForm: false // Contrôle l'affichage du formulaire d'ajout
        }
    },
    // Méthodes du composant
    methods: {
        // Gère l'ajout réussi d'une musique
        handleMusiqueAdded() {
            this.showForm = false; // Cache le formulaire
            this.$refs.musiqueList.fetchMusiques(); // Rafraîchit la liste
        }
    }
}
</script>

<style scoped>
/* Style du conteneur principal */
.musique-page {
    padding: 20px;
}

/* Style du bouton d'ajout */
.add-button {
    margin: 20px 0;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

/* Effet de survol du bouton */
.add-button:hover {
    background-color: #45a049;
}
</style>