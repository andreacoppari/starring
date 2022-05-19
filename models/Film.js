const mongoose = require('mongoose')

const FilmSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Film', FilmSchema)