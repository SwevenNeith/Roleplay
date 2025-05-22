const express = require('express');
const router = express.Router();
const Combat = require('../models/Combat'); // Modèle Combat

// Route pour enregistrer un nouveau combat
router.post('/combats', async (req, res) => {
  try {
    const combatData = req.body;

    // Valide les données avant de les sauvegarder
    if (!combatData.date || !combatData.participants || !combatData.tours || !combatData.pvFinaux || !combatData.nombreTours) {
      return res.status(400).json({ error: "Les données du combat sont incomplètes." });
    }

    // Crée un nouveau combat
    const combat = new Combat(combatData);
    await combat.save();

    res.status(201).json({ message: "Combat enregistré avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du combat :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
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