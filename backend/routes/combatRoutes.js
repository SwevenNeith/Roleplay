const express = require('express');
const router = express.Router();
const Combat = require('../models/Combat'); // Modèle Combat

// Route pour enregistrer un nouveau combat
router.post('/combats', async (req, res) => {
  try {
    const { participants, date, tours } = req.body;

    // Création d'un nouveau document Combat
    const combat = new Combat({ participants, date, tours });
    await combat.save();

    res.status(201).json({ message: 'Combat enregistré avec succès', combat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du combat" });
  }
});

// Route pour récupérer tous les combats
router.get('/combats', async (req, res) => {
  try {
    const combats = await Combat.find().sort({ date: -1 });
    res.json(combats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des combats" });
  }
});

module.exports = router;