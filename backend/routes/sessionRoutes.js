const express = require('express');
const router = express.Router();
const Session = require('../models/Session'); // Importation du modèle Session

// Route POST pour créer une nouvelle session
router.post('/sessions', async (req, res) => {
    try {
        // Crée une nouvelle session avec les données reçues
        const session = new Session(req.body);
        await session.save(); // Sauvegarde la session dans MongoDB
        res.status(201).json({ message: 'Session créée avec succès', session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de la session' });
    }
});

module.exports = router;