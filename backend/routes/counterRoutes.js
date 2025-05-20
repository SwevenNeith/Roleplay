const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter'); // Modèle Counter

// Route pour enregistrer une nouvelle valeur de compteur avec la date actuelle
router.post('/counter', async (req, res) => {
  try {
    const { value } = req.body;
    const date = new Date(); // Date et heure actuelles

    // Création d'un nouveau document Counter
    const counter = new Counter({ value, date });
    await counter.save();

    res.status(201).json(counter); // Renvoie le document créé
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du compteur" });
  }
});

// Route pour récupérer toutes les valeurs du compteur (historique)
router.get('/counter', async (req, res) => {
  try {
    // Récupère tous les compteurs, triés par date décroissante
    const counters = await Counter.find().sort({ date: -1 });
    res.json(counters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des compteurs" });
  }
});

// Route pour récupérer la dernière valeur du compteur
router.get('/counter/latest', async (req, res) => {
  try {
    // Récupère le dernier compteur enregistré
    const latest = await Counter.findOne().sort({ date: -1 });
    if (!latest) {
      return res.status(404).json({ error: 'Aucune valeur de compteur trouvée' });
    }
    res.json(latest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération du dernier compteur" });
  }
});

module.exports = router;