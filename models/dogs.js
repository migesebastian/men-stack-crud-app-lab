const mongoose = require('mongoose');

const dogsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    isReadyForHairCut: Boolean,
});

const Dogs = mongoose.model('Dogs', dogsSchema);

module.exports = Dogs;

