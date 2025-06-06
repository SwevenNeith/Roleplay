const express = require("express"); // Framework web pour Node.js
const router = express.Router(); // Création d'un routeur Express
const Class = require("../models/Classe"); // Importation du modèle de classe
const Voie = require("../models/Voie"); // Importation du modèle de voie

// Route GET /api/classes
// Récupère toutes les classes disponibles
router.get("/classes", async (req, res) => {
  try {
    // Recherche toutes les classes dans la base de données
    const classes = await Class.find();
    // Renvoie les classes au format JSON
    res.json(classes);
  } catch (err) {
    // En cas d'erreur, log l'erreur et renvoie une erreur 500
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des classes" });
  }
});

// Route GET /api/classes/:slug
// Récupère une classe spécifique et ses voies associées
router.get("/classes/:slug", async (req, res) => {
  // Extraction du slug depuis les paramètres de l'URL
  const { slug } = req.params;
  try {
    // Recherche la classe correspondant au slug
    const classe = await Class.findOne({ slug });
    // Si la classe n'existe pas, renvoie une erreur 404
    if (!classe) {
      return res.status(404).json({ error: "Classe non trouvée" });
    }
    // Recherche toutes les voies associées à cette classe
    const voies = await Voie.find({ classe_slug: slug });
    // Renvoie la classe et ses voies
    res.json({ classe, voies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération de la classe" });
  }
});

// Route POST /api/classes
// Crée une nouvelle classe
router.post("/classes", async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const { nom, slug, description, caracteristiques, image } = req.body;

    // Validation des champs obligatoires
    // Vérifie que les champs essentiels sont présents
    if (!nom || !slug || !description || !caracteristiques || !caracteristiques[0]) {
      return res.status(400).json({ 
        error: "Le nom, le slug, la description et au moins une caractéristique sont requis" 
      });
    }

    // Vérification de l'unicité du slug
    // Empêche la création de deux classes avec le même slug
    const existingClasse = await Class.findOne({ slug });
    if (existingClasse) {
      return res.status(400).json({ error: "Une classe avec ce slug existe déjà" });
    }

    // Nettoyage des caractéristiques
    // Supprime les valeurs vides du tableau des caractéristiques
    const cleanedCaracteristiques = caracteristiques.filter(carac => carac !== '');

    // Création de la nouvelle classe
    const newClasse = new Class({
      nom,
      slug,
      description,
      caracteristiques: cleanedCaracteristiques,
      // Si l'image est vide, on la définit comme undefined
      // Cela permet de ne pas stocker de valeur vide dans la base
      image: image || undefined
    });

    // Sauvegarde de la nouvelle classe dans la base de données
    await newClasse.save();
    // Renvoie la classe créée avec un statut 201 (Created)
    res.status(201).json(newClasse);
  } catch (err) {
    // En cas d'erreur, log l'erreur et renvoie une erreur 500
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création de la classe" });
  }
});

// Exportation du routeur pour utilisation dans server.js
module.exports = router;
