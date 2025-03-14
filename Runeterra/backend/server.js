// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes'); // Import des routes
const voieRoutes = require('./routes/voieRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const originRoutes = require('./routes/originRoutes');

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
app.use('/api', userRoutes);
app.use('/api', classRoutes);
app.use('/api', voieRoutes);
app.use('/api', competenceRoutes);
app.use('/api', originRoutes);


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});