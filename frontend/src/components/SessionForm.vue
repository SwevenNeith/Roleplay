<template>
    <!-- Conteneur principal du formulaire de session -->
    <div class="session-form">
        <!-- Titre dynamique basé sur le mode (création/édition) -->
        <h2>{{ isEditing ? 'Modifier la session' : 'Nouvelle session' }}</h2>
        
        <!-- Conteneur des champs du formulaire -->
        <div class="form-container">
            <!-- Champ pour le titre de la session -->
            <input 
                type="text" 
                v-model="formData.title"
                placeholder="Titre" 
                class="form-input"
            />
            
            <!-- Zone de texte pour le contenu détaillé de la session -->
            <textarea 
                v-model="formData.content"
                placeholder="Contenu de la session" 
                class="form-textarea"
            ></textarea>
            
            <!-- Groupe de boutons pour les actions -->
            <div class="button-group">
                <!-- Bouton d'annulation qui émet l'événement 'cancel' -->
                <button @click="$emit('cancel')" class="form-button cancel-button">
                    Annuler
                </button>
                <!-- Bouton de sauvegarde avec texte adaptatif -->
                <button @click="saveSession" class="form-button save-button">
                    {{ isEditing ? 'Enregistrer' : 'Sauvegarder' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // Nom du composant pour le debugging
    name: 'SessionForm',
    
    // Définition des propriétés reçues du composant parent
    props: {
        // initialData contient les données initiales du formulaire
        initialData: {
            type: Object,
            // Valeur par défaut si aucune donnée n'est fournie
            default: () => ({
                title: '',
                content: '',
                _id: null
            })
        }
    },
    
    // Données locales du composant
    data() {
        return {
            // Clone profond des données initiales pour éviter la mutation directe
            formData: JSON.parse(JSON.stringify(this.initialData))
        }
    },
    
    // Propriétés calculées
    computed: {
        // Détermine si on est en mode édition en vérifiant la présence d'un ID
        isEditing() {
            return !!this.formData._id;
        }
    },
    
    // Méthodes du composant
    methods: {
        // Méthode appelée lors de la sauvegarde
        saveSession() {
            // Émet un événement 'submit' avec les données du formulaire vers le parent
            this.$emit('submit', this.formData);
        }
    }
}
</script>

<style scoped>
/* Style du conteneur principal */
.session-form {
    width: 100%;
    max-width: 1200px; /* Limite la largeur maximale */
    margin: 0 auto; /* Centre le formulaire */
    padding: 20px;
}

/* Style du conteneur du formulaire */
.form-container {
    display: flex;
    flex-direction: column; /* Empile les éléments verticalement */
    align-items: center;
    width: 100%;
}

/* Styles communs pour les champs de saisie */
.form-input, 
.form-textarea {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style spécifique pour la zone de texte */
.form-textarea {
    height: 150px; /* Hauteur fixe */
    resize: vertical; /* Permet le redimensionnement vertical uniquement */
    min-height: 100px; /* Hauteur minimale */
    max-height: 400px; /* Hauteur maximale */
}

/* Style du groupe de boutons */
.button-group {
    display: flex;
    gap: 10px; /* Espace entre les boutons */
    justify-content: flex-end; /* Aligne les boutons à droite */
    width: 100%;
}

/* Style de base des boutons */
.form-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s; /* Animation de transition */
}

/* Style du bouton Annuler */
.cancel-button {
    background-color: #f44336; /* Rouge */
    color: white;
}

/* Style du bouton Sauvegarder */
.save-button {
    background-color: #4CAF50; /* Vert */
    color: white;
}

/* Effets de survol des boutons */
.cancel-button:hover {
    background-color: #d32f2f; /* Rouge plus foncé */
}

.save-button:hover {
    background-color: #388e3c; /* Vert plus foncé */
}

/* Style du titre */
h2 {
    color: #2c6578;
    margin-bottom: 20px;
    text-align: center;
}
</style> 