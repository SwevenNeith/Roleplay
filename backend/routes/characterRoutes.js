const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// Récupérer tous les personnages
router.get('/characters', async (req, res) => {
  try {
    const chars = await Character.find({});
    res.json(chars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des personnages" });
  }
});

// Créer un nouveau personnage
router.post('/characters', async (req, res) => {
  try {
    const newChar = new Character(req.body);
    const savedChar = await newChar.save();
    res.status(201).json(savedChar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du personnage" });
  }
});

// Mettre à jour un personnage existant
router.put('/characters/:id', async (req, res) => {
  try {
    const updated = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // renvoie le document mis à jour
    );
    if (!updated) {
      return res.status(404).json({ error: "Personnage introuvable" });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du personnage" });
  }
});

// Supprimer un personnage
router.delete('/characters/:id', async (req, res) => {
  try {
    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Personnage introuvable" });
    }
    res.json({ message: "Personnage supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression du personnage" });
  }
});

module.exports = router;