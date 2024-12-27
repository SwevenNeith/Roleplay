const express = require('express');
const router = express.Router();
const Competence = require('../models/Competences'); // Importation du modèle Competence

// Route GET pour récupérer toutes les compétences
router.get('/competences', async (req, res) => {
  try {
    const competences = await Competence.find(); // Récupère toutes les compétences depuis MongoDB
    res.json(competences); // Renvoie les compétences au format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
  }
});

// Route GET pour récupérer les compétences d'une voie spécifique
router.get('/competences/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Recherche les compétences associées au slug de la voie
    const competences = await Competence.find({ voie_slug: slug });

    if (!competences || competences.length === 0) {
      return res.status(404).json({ error: 'Aucune compétence trouvée pour cette voie' });
    }

    res.json(competences); // Renvoie les compétences associées à la voie
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
  }
});

module.exports = router;
