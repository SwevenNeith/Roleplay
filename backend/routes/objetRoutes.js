const express = require('express');
const router = express.Router();
const Objet = require('../models/Objet'); // Importation du modèle Objet

// Route GET pour récupérer touts les objets
router.get('/objets', async (req, res) => {
  try {
    const objets = await Objet.find(); // Récupère toutes les objets depuis MongoDB
    res.json(objets); // Renvoie les objets au format JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des objets' });
  }
});

// Créer un nouvel objet
router.post('/objets', async (req, res) => {
  try {
    const objet = new Objet(req.body);
    await objet.save();
    res.status(201).json({ message: 'Objet créé avec succès', objet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de l'objet" });
  }
});

// Modifier un objet existant
router.put('/objets/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updated = await Objet.findOneAndUpdate(
      { slug },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Objet non trouvé' });
    }
    res.json({ message: 'Objet modifié avec succès', objet: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la modification de la compétence" });
  }
});

// Supprimer un objet existant
router.delete('/objets/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await Objet.findOneAndDelete({ slug });
    if (!deleted) {
      return res.status(404).json({ error: 'Objet non trouvé' });
    }
    res.json({ message: 'Objet supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'objet" });
  }
});

module.exports = router;
