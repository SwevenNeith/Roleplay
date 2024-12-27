const express = require('express');
const Voie = require('../models/Voie');

const router = express.Router();

// Route pour récupérer toutes les voies
router.get('/voies', async (req, res) => {
  try {
    // Récupère toutes les voies dans la collection `runeterra_voies`
    const voies = await Voie.find(); 
    res.json(voies); // Renvoie les données sous forme JSON
  } catch (err) {
    // En cas d'erreur, retourne un message d'erreur avec un statut 500
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
