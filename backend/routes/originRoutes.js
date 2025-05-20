const express = require('express');
const router = express.Router();
const Origin = require('../models/Origin'); // Modèle Origin

// Route pour récupérer toutes les origines
router.get('/origins', async (req, res) => {
  try {
    const origins = await Origin.find(); // Recherche toutes les origines
    res.json(origins); // Renvoie les données au format JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des origines' });
  }
});

// Route pour récupérer une origine spécifique
router.get('/origins/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const origin = await Origin.findOne({ slug }); // Recherche une origine par son slug

    if (!origin) {
      return res.status(404).json({ error: 'Origine non trouvée' });
    }

    res.json(origin); // Renvoie l'origine trouvée
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'origine' });
  }
});

module.exports = router;
