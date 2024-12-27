const express = require('express');
const router = express.Router();
const Voie = require('../models/Voie');
const Competence = require('../models/Competences'); // Importation du modèle de compétence

// Route GET pour récupérer toutes les voies
router.get('/voies', async (req, res) => {
  try {
    const voies = await Voie.find(); // Récupère toutes les voies depuis MongoDB
    res.json(voies); // Renvoie les voies au format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des voies' });
  }
});

// Route GET pour récupérer une voie avec ses compétences
router.get('/voies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Recherche la voie par son slug
    const voie = await Voie.findOne({ slug });

    if (!voie) {
      return res.status(404).json({ error: 'Voie non trouvée' });
    }

    // Recherche des compétences associées à cette voie
    const competences = await Competence.find({ voie_slug: voie.slug });

    res.json({ voie, competences }); // Renvoie la voie et ses compétences
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la voie et des compétences' });
  }
});

module.exports = router;
