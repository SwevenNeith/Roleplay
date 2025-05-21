// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const classeRoutes = require('./routes/classeRoutes'); // Import des routes
const voieRoutes = require('./routes/voieRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const origineRoutes = require('./routes/origineRoutes');
const counterRoutes = require('./routes/counterRoutes');
const characterRoutes = require('./routes/characterRoutes');

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
app.use('/api', classeRoutes);
app.use('/api', voieRoutes);
app.use('/api', competenceRoutes);
app.use('/api', origineRoutes);
app.use('/api', counterRoutes);
app.use('/api', characterRoutes);


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});