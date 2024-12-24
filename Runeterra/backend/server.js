// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Utiliser CORS pour permettre à Vue.js d'accéder à cette API
app.use(cors());

// Route d'exemple : Renvoie un message depuis le backend
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Node.js backend!' });
});

// Démarrer le serveur sur le port 3000
app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
