const mongoose = require('mongoose');

/**
 * Schéma pour les combats
 * Enregistre le déroulement complet d'un combat, y compris :
 * - Les participants et leurs statistiques
 * - Le déroulement tour par tour
 * - Les résultats finaux et la progression des personnages
 */
const combatSchema = new mongoose.Schema({
  // Date du combat au format YYYY-MM-DD
  date: { type: String, required: true },

  // Liste des participants au combat
  participants: [
    {
      nom: { type: String, required: true },
      initiative: { type: Number, required: true },
      pvDebut: { type: [Number], required: true }, // [PV actuel, PV max] au début du combat
      experienceGagnee: { type: Number, default: 0 } // XP gagnée pendant le combat
    }
  ],

  // Enregistrement des actions tour par tour
  tours: [
    {
      numero: { type: Number, required: true }, // Numéro du tour
      actions: [
        {
          acteur: { type: String, required: true }, // Personnage effectuant l'action
          competence: {
            nom: { type: String, required: true },
            type: { type: String, required: true } // Type : Attaque, Soin, Défense
          },
          cible: { type: String, required: true },
          reussi: { type: Boolean, required: true },
          degats: { type: Number, required: true },
          pvActuels: { type: Map, of: Number, required: true } // État des PV après l'action
        }
      ]
    }
  ],

  // État final des points de vie
  pvFinaux: [
    {
      nom: { type: String, required: true },
      pvFin: { type: [Number], required: true } // [PV final, PV max]
    }
  ],

  // Progression des personnages
  experience: [
    {
      nom: { type: String, required: true },
      xpGagnee: { type: Number, required: true },     // XP obtenue dans ce combat
      niveauDebut: { type: Number, required: true },  // Niveau avant le combat
      niveauFin: { type: Number, required: true },    // Niveau après le combat
      xpDebut: { type: Number, required: true },      // XP avant le combat
      xpFin: { type: Number, required: true }         // XP après le combat et montée de niveau
    }
  ],

  // Statistiques globales du combat
  nombreTours: { type: Number, required: true }
});

// Exportation du modèle Combat
module.exports = mongoose.model('Combat', combatSchema, 'runeterra_combats');