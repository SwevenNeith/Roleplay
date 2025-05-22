const mongoose = require('mongoose');

// Schéma pour les sessions
const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Titre de la session
    content: { type: String, required: true }, // Contenu de la session
    createdAt: { type: String, required: true }, // Date au format YYYY-MM-DD
});

// Exporte le modèle 'Session' pour l'utiliser dans les routes
module.exports = mongoose.model('Session', sessionSchema, 'runeterra_sessions');