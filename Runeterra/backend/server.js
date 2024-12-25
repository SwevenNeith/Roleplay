const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Activer CORS pour permettre les requêtes depuis le frontend
app.use(cors());

// API pour les pages du Header
app.get('/api/pages', (req, res) => {
    const pages = [
    { id: 1, title: 'Accueil', path: '/' },
    { id: 2, title: 'À Propos', path: '/about' },
    { id: 3, title: 'Contact', path: '/contact' },
    ];
    res.json(pages);
});

// API pour des exemples de contenu (si besoin)
app.get('/api/message', (req, res) => {
    res.json({ message: 'Bonjour depuis le backend !' });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
