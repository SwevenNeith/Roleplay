const mongoose = require('mongoose');

// Schéma pour les combats
const combatSchema = new mongoose.Schema({
  participants: [
    {
      nom: { type: String, required: true },
      initiative: { type: Number, required: true }
    }
  ],
  date: { type: String, required: true }, // Date au format YYYY-MM-DD
  tours: { type: Number, required: true } // Compteur des tours
});

// Exportation du modèle Combat, collection: runeterra_combats
module.exports = mongoose.model('Combat', combatSchema, 'runeterra_combats');