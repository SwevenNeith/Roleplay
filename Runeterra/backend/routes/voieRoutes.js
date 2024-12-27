const express = require("express"); // Importation d'Express
const router = express.Router(); // Initialisation du routeur Express
const Voie = require("../models/Voie"); // Importation du modèle de voie

// Route GET pour récupérer toutes les voies
router.get("/voies", async (req, res) => {
  try {
    const voies = await Voie.find(); // Récupère toutes les voies depuis MongoDB
    res.json(voies); // Renvoie les voies au format JSON
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des voies" }); // En cas d'erreur
  }
});

module.exports = router; // Exporte le routeur
