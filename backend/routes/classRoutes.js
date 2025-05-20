const express = require("express"); // Importation du framework Express
const router = express.Router(); // Création d'une instance de routeur
const Class = require("../models/RuneterraClass"); // Importation du modèle Class
const Voie = require("../models/Voie"); // Importation du modèle Voie

// Route GET pour récupérer toutes les classes
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find(); // Récupère toutes les classes depuis la collection
    res.json(classes); // Renvoie les données au format JSON
  } catch (err) {
    console.error(err); // Logue l'erreur dans la console pour débogage
    res.status(500).json({ error: "Erreur lors de la récupération des classes" }); // Retourne un statut 500 en cas d'erreur serveur
  }
});

// Route GET pour récupérer une classe spécifique et ses voies associées
router.get("/classes/:slug", async (req, res) => {
  const { slug } = req.params; // Récupère le slug depuis les paramètres de la requête
  try {
    const classe = await Class.findOne({ slug }); // Recherche une classe correspondant au slug
    if (!classe) {
      return res.status(404).json({ error: "Classe non trouvée" }); // Retourne un statut 404 si la classe n'existe pas
    }
    const voies = await Voie.find({ classe_slug: slug }); // Recherche toutes les voies associées à la classe
    res.json({ classe, voies }); // Renvoie les données de la classe et des voies associées
  } catch (err) {
    console.error(err); // Logue l'erreur dans la console pour débogage
    res.status(500).json({ error: "Erreur lors de la récupération de la classe" }); // Retourne un statut 500 en cas d'erreur serveur
  }
});

module.exports = router; // Exporte le routeur pour être utilisé dans server.js
