const mongoose = require('mongoose');

// Définition du schéma Origin
const originSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // Identifiant unique de l'origine
  nom: { type: String, required: true }, // Nom de l'origine
  description: { type: String, required: true }, // Description de l'origine
  traits: [{ type: String }], // Liste des traits spécifiques à l'origine
  regions_associees: [{ type: String }], // Liste des régions associées
});

// Exportation du modèle
module.exports = mongoose.model('Origin', originSchema, 'runeterra_origins');
