// Import de Mongoose pour la gestion de la base de données MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour les musiques
const musiqueSchema = new mongoose.Schema({
    // Titre de la musique (obligatoire)
    titre: {
        type: String,
        required: true
    },
    // Artiste/compositeur (obligatoire)
    artiste: {
        type: String,
        required: true
    },
    // Thème/catégorie de la musique (obligatoire)
    theme: {
        type: String,
        required: true
    },
    // Lien vers la vidéo YouTube (obligatoire)
    youtubeLink: {
        type: String,
        required: true
    }
});

// Export du modèle avec le nom de la collection spécifique
module.exports = mongoose.model('Musique', musiqueSchema, 'runeterra_playlist'); 