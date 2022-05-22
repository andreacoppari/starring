const { url } = require('inspector')
const mongoose = require('mongoose')

const Movie = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    'Starring rating': {
        type: Number,
        required: true
    },
    genres: {
        type: Array,
    },
    cast: {
        type: Array,
    },
    plot: {
        type: String,
    },
    reviews: {
        type: Array,
    },
    cover: {
        type: String
    }
},
{
    collection: 'movies'
}
)

const model = mongoose.model('Movie', Movie)

module.exports = model