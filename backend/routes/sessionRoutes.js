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

// Route PUT pour modifier une session
router.put('/sessions/:id', async (req, res) => {
    try {
        const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Session modifiée avec succès', updatedSession });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification de la session' });
    }
});

// Route DELETE pour supprimer une session
router.delete('/sessions/:id', async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Session supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la session' });
    }
});

module.exports = router;