const mongoose = require('mongoose');

const runeterraClassSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    description: { type: String, required: true },
    caracteristiques: { type: [String], required: true },
    image: { type: String },
});

// Le troisième paramètre force le nom de la collection à 'runeterra_classes'.
module.exports = mongoose.model('RuneterraClass', runeterraClassSchema, 'runeterra_classes');
