// /models/Competence.js
const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  systeme: { type: String, enum: ['PM', 'Cooldown', 'Action', 'PM + CD', 'CD + Action', 'PM + Action'], required: false },
  systeme_value: { type: String, required: false },
  voie_slug: { type: String, required: false },
  // type: { type: String, enum: ['Attaque', 'Soin', 'Défense'], required: false },
  description: { type: String },
  niveau: { type: Number },
  composant: { type: [String], default: [] }, // Liste des composants (Verbal, Matériel, Somatique)
  portee: { type: String },
  zone: { type: String },
  temps_incantation: { type: String },
  duree: { type: String },
  degats: { type: String },
  allie: { type: String },
  ennemi: { type: String },
  sauvegarde: { type: String },
  theme: { type: [String], default: [] }, // Liste de thèmes
}, { strict: false }); // strict: false permet d'accepter d'autres champs si besoin

// Exporte le modèle 'Competence' pour l'utiliser dans les routes
module.exports = mongoose.model('Competence', competenceSchema, 'runeterra_competences');
