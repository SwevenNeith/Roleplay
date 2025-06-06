// Importation de mongoose pour la création du schéma
const mongoose = require('mongoose');

// Définition du schéma pour les classes de Runeterra
const runeterraClassSchema = new mongoose.Schema({
    // Slug unique pour l'URL et l'identification
    // required: true -> le champ est obligatoire
    // unique: true -> deux classes ne peuvent pas avoir le même slug
    slug: { type: String, required: true, unique: true },

    // Nom de la classe (obligatoire)
    nom: { type: String, required: true },

    // Description détaillée de la classe (obligatoire)
    description: { type: String, required: true },

    // Tableau des caractéristiques principales de la classe
    caracteristiques: { 
        type: [String], // Type tableau de chaînes de caractères
        required: true, // Le tableau est obligatoire
        validate: {
            // Fonction de validation personnalisée
            validator: function(v) {
                // Vérifie qu'il y a au moins une caractéristique dans le tableau
                return v.length > 0;
            },
            // Message d'erreur si la validation échoue
            message: 'Au moins une caractéristique est requise'
        }
    },

    // URL de l'image de la classe (optionnel)
    // required: false -> le champ n'est pas obligatoire
    image: { type: String, required: false }
});

// Exportation du modèle
// 'RuneterraClass' -> nom du modèle
// runeterraClassSchema -> schéma utilisé
// 'runeterra_classes' -> nom de la collection dans MongoDB
module.exports = mongoose.model('RuneterraClass', runeterraClassSchema, 'runeterra_classes');
