const mongoose = require('mongoose');

const voieSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // Identifiant unique
  classe_slug: { type: String, required: true }, // Référence vers la classe
  nom: { type: String, required: true }, // Nom de la voie
  description: { type: String, required: true }, // Description de la voie
});

module.exports = mongoose.model('Voie', voieSchema, 'runeterra_voies');