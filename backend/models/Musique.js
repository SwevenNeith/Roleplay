const mongoose = require('mongoose');

const musiqueSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    artiste: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    youtubeLink: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Musique', musiqueSchema, 'runeterra_playlist'); 