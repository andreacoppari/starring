const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'An username is required']
    },
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        validate:[isEmail, 'This email is invalid']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [8, 'The password must be at least 8 characters long']
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

//hashing passwords
User.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const model = mongoose.model('User', User)

module.exports = model