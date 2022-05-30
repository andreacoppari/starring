/*
REVIEW:
{
    _id: 2345678
    movie: 34567
    review: 1234
    user: 1234
}

USER:
{
    reviews: [ 
        _id
    ]
}

MOVIE:
{
    reviews: [imdb-reviews]
    userreviews: [
        _id
    ]
}
*/
const mongoose = require('mongoose')

const Review = new mongoose.Schema({
    movie: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
{
    collection: 'reviews'
}
)

const model = mongoose.model('Review', Review)

module.exports = model