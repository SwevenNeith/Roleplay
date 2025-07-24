// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const classeRoutes = require('./routes/classeRoutes'); // Import des routes
const voieRoutes = require('./routes/voieRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const objetRoutes = require('./routes/objetRoutes'); // Ajout des routes pour les objets
const origineRoutes = require('./routes/origineRoutes');
const characterRoutes = require('./routes/characterRoutes');
const combatRoutes = require('./routes/combatRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const combinedRoutes = require('./routes/combinedRoutes'); // Importation des routes combinées
const musiqueRoutes = require('./routes/musiqueRoutes'); // Ajout des routes pour les musiques


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/Runeterra', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Routes
app.use('/api', classeRoutes);
app.use('/api', voieRoutes);
app.use('/api', competenceRoutes);
app.use('/api', objetRoutes);
app.use('/api', origineRoutes);
app.use('/api', characterRoutes);
app.use('/api', combatRoutes);
app.use('/api', sessionRoutes);
app.use('/api', combinedRoutes); // Ajoute les routes combinées
app.use('/api', musiqueRoutes); // Utilisation des routes pour les musiques
app.use('/api', objetRoutes); // Utilisation des routes pour les objets

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});