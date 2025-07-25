// /models/Competence.js
const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  voie_slug: { type: String, required: false },
  type: { type: String, enum: ['Attaque', 'Soin', 'Défense'], required: true },
  description: { type: String },
  niveau: { type: Number },
  degats: { type: String },
  allie: { type: String },
  ennemi: { type: String },
  sauvegarde: { type: String },
  portee: { type: String },
  duree: { type: String },
  theme: { type: [String], default: [] }, // Liste de thèmes
  composant: { type: [String], default: [] }, // Liste des composants (Verbal, Matériel, Somatique)
}, { strict: false }); // strict: false permet d'accepter d'autres champs si besoin

// Exporte le modèle 'Competence' pour l'utiliser dans les routes
module.exports = mongoose.model('Competence', competenceSchema, 'runeterra_competences');
