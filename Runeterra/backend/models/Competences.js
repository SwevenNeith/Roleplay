// /models/Competence.js
const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // Identifiant unique pour chaque compétence
  voie_slug: { type: String, required: true }, // Identifiant de la voie associée
  nom: { type: String, required: true }, // Nom de la compétence
  description: { type: String, required: true }, // Description de la compétence
  niveau: { type: Number, min: 1, max: 5, required: true }, // Niveau de la compétence (1 à 5)
  degats: { type: String }, // Description des dégâts infligés
  allie: { type: String }, // Description des effets sur les alliés
  ennemi: { type: String }, // Description des effets sur les ennemis
  sauvegarde: { type: String }, // Description des sauvegardes requises
  portee: { type: String }, // Portée de la compétence
  duree: { type: String }, // Durée de la compétence
});

// Exporte le modèle 'Competence' pour l'utiliser dans les routes
module.exports = mongoose.model('Competence', competenceSchema, 'runeterra_competences');
