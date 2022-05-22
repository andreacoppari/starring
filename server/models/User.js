const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    watchlist: {
        type: Array,
        default: []
    }
},
{
    collection: 'users'
}
)

const model = mongoose.model('User', User)

module.exports = model