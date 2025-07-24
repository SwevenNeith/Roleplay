// /models/Objet.js
const mongoose = require('mongoose');

const objetSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
}, { strict: false }); // strict: false permet d'accepter d'autres champs si besoin

// Exporte le modèle 'Objet' pour l'utiliser dans les routes
module.exports = mongoose.model('Objet', objetSchema, 'runeterra_objets');
