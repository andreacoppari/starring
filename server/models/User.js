const mongoose = require('mongoose')
const { isEmail } = require('validator');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'An username is required']
    },
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        validate:[isEmail, 'this email is invalid']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [8, 'the password must be at least 8 characters long']
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