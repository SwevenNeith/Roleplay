const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  nom: { type: String, default: '' },
  race: { type: String, default: '' },
  classe: { type: String, default: '' },
  joueur: { type: String, default: '' },
  experience: { type: Number, default: 0 },
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
  pv: { type: Number, default: 0 },
  vitesse: { type: Number, default: 0 },
  deRecup: { type: String, default: '' },
  jetsReussis: { type: [Boolean], default: [false, false, false] },
  jetsEchoues: { type: [Boolean], default: [false, false, false] },
  inventaire: { type: String, default: '' },
  background: { type: String, default: '' },
  image: { type: String, default: '' },
  competences: [
    {
      nom: { type: String, required: true },
      voie: { type: String, required: true },
      type: { type: String, enum: ['Attaque', 'Soin', 'Défense'], required: true },
      slug: { type: String, required: true },
      voie_slug: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Character', characterSchema, 'runeterra_characters');