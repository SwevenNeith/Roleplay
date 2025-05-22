const mongoose = require('mongoose');

// Schéma pour les combats
const combatSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Date au format YYYY-MM-DD
  participants: [
    {
      nom: { type: String, required: true },
      initiative: { type: Number, required: true },
      pvDebut: { type: [Number], required: true } // [PV actuel, PV max] au début du combat
    }
  ],
  tours: [
    {
      numero: { type: Number, required: true }, // Numéro du tour
      actions: [
        {
          acteur: { type: String, required: true }, // Nom du personnage qui agit
          competence: {
            nom: { type: String, required: true }, // Nom de la compétence utilisée
            type: { type: String, required: true } // Type de la compétence (Attaque, Soin, Défense)
          },
          cible: { type: String, required: true }, // Nom de la cible
          reussi: { type: Boolean, required: true }, // Indique si la compétence a réussi
          pvActuels: { type: Map, of: Number, required: true } // PV actuels de tous les participants après l'action
        }
      ]
    }
  ],
  pvFinaux: [
    {
      nom: { type: String, required: true },
      pvFin: { type: [Number], required: true } // [PV actuel, PV max] à la fin du combat
    }
  ],
  nombreTours: { type: Number, required: true } // Nombre total de tours
});

// Exportation du modèle Combat, collection: runeterra_combats
module.exports = mongoose.model('Combat', combatSchema, 'runeterra_combats');