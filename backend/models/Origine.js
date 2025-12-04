const mongoose = require('mongoose');

// Définition du schéma Origin
const originSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // Identifiant unique de l'origine
  nom: { type: String, required: true }, // Nom de l'origine
  description: { type: String, required: false, default: '' }, // Description de l'origine (optionnelle)
  traits: [{ type: String }], // Liste des traits spécifiques à l'origine
  regions_associees: [{ type: String }], // Liste des régions associées
  position_x: { type: Number, required: false, default: 5 }, // Position X sur la carte (en pourcentage 0-100)
  position_y: { type: Number, required: false, default: 5 }, // Position Y sur la carte (en pourcentage 0-100)
});

// Exportation du modèle
module.exports = mongoose.model('Origin', originSchema, 'runeterra_origins');
