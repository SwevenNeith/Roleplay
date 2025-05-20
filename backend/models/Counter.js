const mongoose = require('mongoose');

// Schéma pour le compteur, chaque entrée a une valeur et une date unique
const counterSchema = new mongoose.Schema({
  value: { type: Number, required: true }, // Valeur du compteur
  date: { type: Date, required: true, unique: true }, // Date et heure de l'enregistrement (unique)
});

// Exportation du modèle Counter, collection: runeterra_counters
module.exports = mongoose.model('Counter', counterSchema, 'runeterra_counters');