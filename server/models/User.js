const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'An username is required'],
        minlength: [3, 'The username must be at least 3 characters long'],
        maxlength: [24, 'The username must be a maximum of 24 characters long']
    },
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        validate:[isEmail, 'This email is invalid'],
        maxlength: [24, 'The email must be a maximum of 24 characters long']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        //autenticazione con Google (passaggio 5)
        //commentare la riga sottostabte (minlenght), il controllo è stato trasferito in index.js
        minlength: [8, 'The password must be at least 8 characters long'],
        maxlength: [24, 'The password must be a maximum of 24 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    watchlist: {
        type: Array,
        default: []
    },
    reviews: {
        type: Array,
        default: []
    }
},
{
    collection: 'users'
}
)

//hashing passwords
User.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const model = mongoose.model('User', User)

module.exports = model