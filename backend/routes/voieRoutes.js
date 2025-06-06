const express = require('express');
const router = express.Router();
const Voie = require('../models/Voie');
const Competence = require('../models/Competence'); // Importation du modèle de compétence

// Route GET /api/voies
// Récupère toutes les voies de la base de données
router.get('/voies', async (req, res) => {
  try {
    const voies = await Voie.find(); // Récupère toutes les voies depuis MongoDB
    res.json(voies); // Renvoie les voies au format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des voies' });
  }
});

// Route POST /api/voies
// Crée une nouvelle voie dans la base de données
router.post('/voies', async (req, res) => {
  try {
    // Récupère les données du corps de la requête
    const { nom, slug, classe_slug, description } = req.body;

    // Vérifie si une voie avec le même slug existe déjà
    const existingVoie = await Voie.findOne({ slug });
    if (existingVoie) {
      return res.status(400).json({ error: 'Une voie avec ce nom existe déjà' });
    }

    // Crée une nouvelle instance de Voie avec les données reçues
    const nouvelleVoie = new Voie({
      nom,
      slug,
      classe_slug,
      description
    });

    // Sauvegarde la nouvelle voie dans la base de données
    await nouvelleVoie.save();
    // Renvoie la voie créée avec un statut 201 (Created)
    res.status(201).json(nouvelleVoie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la voie' });
  }
});

// Route GET /api/voies/:slug
// Récupère une voie spécifique et ses compétences associées
router.get('/voies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Recherche la voie par son slug
    const voie = await Voie.findOne({ slug });

    // Si la voie n'existe pas, renvoie une erreur 404
    if (!voie) {
      return res.status(404).json({ error: 'Voie non trouvée' });
    }

    // Recherche toutes les compétences associées à cette voie
    const competences = await Competence.find({ voie_slug: voie.slug });

    // Renvoie la voie et ses compétences
    res.json({ voie, competences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la voie et des compétences' });
  }
});

module.exports = router;
