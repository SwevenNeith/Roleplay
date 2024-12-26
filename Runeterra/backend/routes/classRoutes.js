const express = require('express');
const RuneterraClass = require('../models/RuneterraClass'); // Modèle importé

const router = express.Router();

// Route pour récupérer toutes les classes
router.get('/classes', async (req, res) => {
    try {
        const classes = await RuneterraClass.find(); // Récupère toutes les classes
        res.json(classes);
    } 
    catch (err) {
        console.error('Erreur lors de la récupération des classes :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des classes.' });
    }
});

// Export du routeur
module.exports = router;
