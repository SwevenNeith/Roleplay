const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Combat = require('../models/Combat');

// Route pour récupérer et trier les sessions et combats
router.get('/combined', async (req, res) => {
    try {
        // Récupère toutes les sessions avec toutes leurs données (inclut _id)
        const sessions = await Session.find({}).lean();
        // Ajoute un type pour identifier les sessions
        const formattedSessions = sessions.map(session => ({
            type: 'Session',
            _id: session._id, // Inclut l'ID
            title: session.title,
            content: session.content,
            date: session.createdAt
        }));

        // Récupère tous les combats avec toutes leurs données (inclut _id)
        const combats = await Combat.find({}).lean();
        // Ajoute un type pour identifier les combats
        const formattedCombats = combats.map(combat => ({
            type: 'Combat',
            _id: combat._id, // Inclut l'ID
            date: combat.date,
            participants: combat.participants,
            tours: combat.tours,
            pvFinaux: combat.pvFinaux,
            nombreTours: combat.nombreTours
        }));

        // Combine les deux listes
        const combinedData = [...formattedSessions, ...formattedCombats];

        // Trie les données par date (du plus ancien au plus récent)
        combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(combinedData); // Renvoie les données triées
    } catch (error) {
        console.error('Erreur lors de la récupération des données combinées:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données combinées' });
    }
});

module.exports = router;