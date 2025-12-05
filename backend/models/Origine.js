const mongoose = require('mongoose');

// Définition du schéma Origin
const originSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // Identifiant unique de l'origine
  nom: { type: String, required: true }, // Nom de l'origine
  position_x: { type: Number, required: false, default: 5 }, // Position X sur la carte (en pourcentage 0-100)
  position_y: { type: Number, required: false, default: 5 }, // Position Y sur la carte (en pourcentage 0-100)
  // Nouveaux champs pour le contenu riche
  themes_majeurs: { type: String, required: false },
  geographie: { type: String, required: false },
  histoire: { type: String, required: false },
  factions: { type: String, required: false },
  champions: { type: String, required: false },
  evenements: { type: String, required: false }
});

// Exportation du modèle
module.exports = mongoose.model('Origin', originSchema, 'runeterra_origins');
