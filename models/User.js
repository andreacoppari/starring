const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
//        required: true
    },
    displayName: {
        type: String,
        required: [true, 'An username is required']
    },
    firstName: {
        type: String,
//        required: true
    },
    lastName: {
        type: String,
//        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: [true, 'This email is already used'],
        lowercase: true,
        validate:[isEmail, 'this email is invalid']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [8, 'the password must be at least 8 characters long']
    }
})

//hashing passwords
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema)