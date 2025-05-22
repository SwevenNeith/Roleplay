// /models/Competence.js
const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  voie: { type: String, required: true },
  voie_slug: { type: String, required: true },
  type: { type: String, enum: ['Attaque', 'Soin', 'Défense'], required: true }
});

// Exporte le modèle 'Competence' pour l'utiliser dans les routes
module.exports = mongoose.model('Competence', competenceSchema, 'runeterra_competences');
