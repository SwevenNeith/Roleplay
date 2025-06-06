const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schéma de personnage pour MongoDB
 * Gère les informations de base, les statistiques, et la progression du personnage
 */
const characterSchema = new mongoose.Schema({
  // Informations de base du personnage
  nom: { type: String, default: '' },
  race: { type: String, default: '' },
  classe: { type: String, default: '' },
  joueur: { type: String, default: '' },

  // Système de progression
  niveau: { 
    type: Number, 
    default: 1, 
    min: 1,    // Niveau minimum
    max: 5     // Niveau maximum
  },
  experience: { 
    type: Number, 
    default: 0  // Points d'expérience actuels
    // Le maximum d'XP dépend du niveau : niveau * 100
    // Exemple : Niveau 1 = 100 XP max, Niveau 2 = 200 XP max, etc.
  },

  // Caractéristiques du personnage
  caracs: {
    Force: { type: Number, default: 0 },
    Dextérité: { type: Number, default: 0 },
    Constitution: { type: Number, default: 0 },
    Intelligence: { type: Number, default: 0 },
    Sagesse: { type: Number, default: 0 },
    Charisme: { type: Number, default: 0 }
  },
  inspiration: { type: Number, default: 0 },
  maitrises: { type: Object, default: {} },
  armure: { type: Number, default: 0 },
  pv: {
    type: [Number], // Tableau contenant [PV actuel, PV max]
    default: [0, 0], // Valeurs par défaut
    validate: {
      validator: function (v) {
        return v.length === 2 && v[0] <= v[1]; // Vérifie que PV actuel <= PV max
      },
      message: "Les PV actuels doivent être inférieurs ou égaux aux PV max."
    }
  },
  vitesse: { type: Number, default: 0 },
  deRecup: { type: String, default: '' },
  jetsReussis: { type: [Boolean], default: [false, false, false] },
  jetsEchoues: { type: [Boolean], default: [false, false, false] },
  inventaire: { type: String, default: '' },
  background: { type: String, default: '' },
  image: { type: String, default: '' },
  competences: [{ type: Schema.Types.Mixed }]
});

module.exports = mongoose.model('Character', characterSchema, 'runeterra_characters');