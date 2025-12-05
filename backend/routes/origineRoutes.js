const express = require('express');
const router = express.Router();
const Origin = require('../models/Origine'); // Modèle Origin

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

// Route pour mettre à jour une origine spécifique
router.put('/origins/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { 
      nom, // Ajout de la possibilité de modifier le nom
      position_x, 
      position_y,
      themes_majeurs,
      geographie,
      histoire,
      factions,
      champions,
      evenements
    } = req.body;

    // Recherche et mise à jour de l'origine
    const origin = await Origin.findOneAndUpdate(
      { slug },
      { 
        nom, // Ajout de la possibilité de modifier le nom
        position_x,
        position_y,
        themes_majeurs,
        geographie,
        histoire,
        factions,
        champions,
        evenements
      },
      { new: true, runValidators: true } // Retourne le document mis à jour et valide les données
    );

    if (!origin) {
      return res.status(404).json({ error: 'Origine non trouvée' });
    }

    res.json(origin); // Renvoie l'origine mise à jour
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'origine' });
  }
});

// Route pour créer une nouvelle origine
router.post('/origins', async (req, res) => {
  try {
    const { 
      slug, 
      nom, 
      position_x, 
      position_y,
      themes_majeurs,
      geographie,
      histoire,
      factions,
      champions,
      evenements
    } = req.body;

    // Vérifier si une origine avec ce slug existe déjà
    const existingOrigin = await Origin.findOne({ slug });
    if (existingOrigin) {
      return res.status(409).json({ error: 'Une origine avec ce slug existe déjà' });
    }

    // Créer une nouvelle origine
    const newOrigin = new Origin({
      slug,
      nom,
      position_x,
      position_y,
      themes_majeurs,
      geographie,
      histoire,
      factions,
      champions,
      evenements
    });

    // Sauvegarder dans la base de données
    await newOrigin.save();

    res.status(201).json(newOrigin); // Renvoie la nouvelle origine créée
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de l\'origine' });
  }
});

module.exports = router;
