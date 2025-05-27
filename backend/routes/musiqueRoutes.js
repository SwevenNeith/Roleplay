// Import des dépendances nécessaires
const express = require('express');
const router = express.Router();
const Musique = require('../models/Musique');

// Route GET pour récupérer toutes les musiques
// Tri par thème puis par titre
router.get('/musiques', async (req, res) => {
    try {
        const musiques = await Musique.find().sort({ theme: 1, titre: 1 });
        res.json(musiques);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des musiques' });
    }
});

// Route GET pour récupérer les musiques d'un thème spécifique
// Tri par titre
router.get('/musiques/theme/:theme', async (req, res) => {
    const { theme } = req.params;
    try {
        const musiques = await Musique.find({ theme }).sort({ titre: 1 });
        res.json(musiques);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des musiques par thème' });
    }
});

// Route POST pour créer une nouvelle musique
// Validation automatique grâce au schéma Mongoose
router.post('/musiques', async (req, res) => {
    try {
        const musique = new Musique(req.body);
        const nouvelleMusiqueMusique = await musique.save();
        res.status(201).json(nouvelleMusiqueMusique);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Erreur lors de l\'ajout de la musique' });
    }
});

// Route DELETE pour supprimer une musique par son ID
// Vérifie l'existence avant la suppression
router.delete('/musiques/:id', async (req, res) => {
    try {
        const musique = await Musique.findByIdAndDelete(req.params.id);
        if (!musique) {
            return res.status(404).json({ error: 'Musique non trouvée' });
        }
        res.json({ message: 'Musique supprimée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la musique' });
    }
});

// Route PUT pour mettre à jour une musique par son ID
// Validation et retourne la version mise à jour
router.put('/musiques/:id', async (req, res) => {
    try {
        const musique = await Musique.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,          // Retourne le document mis à jour
                runValidators: true // Active la validation du schéma
            }
        );
        if (!musique) {
            return res.status(404).json({ error: 'Musique non trouvée' });
        }
        res.json(musique);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Erreur lors de la mise à jour de la musique' });
    }
});

// Export du routeur pour utilisation dans l'application
module.exports = router; 