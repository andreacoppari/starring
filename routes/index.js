const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { cookie } = require('express-validator');


// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    Promise.all([
        mongoose.connection.db.collection('movies').find().limit(10).sort({'Starring rating': -1}).toArray(),
        mongoose.connection.db.collection('movies').find().limit(10).sort({'year': -1}).toArray()
    ])
    .then(([film_recommended, film_new]) => {
        res.render('homepage', {content_rec: film_recommended, content_new: film_new})
    })
})

// @desc    Login
// @route   GET /login
router.get('/login', (req, res) => {
    res.render('login',
    {layout: 'login'
    })
})

// @desc    Signup
// @route   GET /signup
router.get('/signup', (req, res) => {
    res.render('signup',
    {layout: 'signup'})
})

// @desc    Film
// @route   GET /film
router.get('/search', (req, res) => {
    console.log("log: "+req.query.search)
    mongoose.connection.db.collection('movies').find({"title": new RegExp('.*' + req.query.search + '.*')}).toArray()
    .then(results => {
        console.log("res: "+results)
        res.render('search', {content: results})
    })
})

// @desc    Film
// @route   GET /film/:id
router.get('/film/:id', (req, res) => {
    // Search in database for film with title = id
    mongoose.connection.db.collection('movies').find({"title": new RegExp(req.params.id)}).limit(1).toArray()
    .then(results => {
        // Check if there is at least one film in database, if not redirect to homepage
        if(results.length > 0)
            res.render('film', {layout: 'film', film: results})
        else
            res.redirect('/')
    })
})

Handlebars.registerHelper('limit', function(arr, limit) {
    if (!Array.isArray(arr)){ return [];}
    return arr.slice(0, limit);
});

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username: '', email: '', password: ''};

    //duplicate error code
     if (err.code === 11000){
         errors.email = 'that email is already registered';
         return errors;
     }

     if(err.message === 'different passwords'){
        errors.password = 'the passwords must be the same';
        return errors;
     }
    //validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 24*60*60;
const createToken = (id) => {
    return jwt.sign({id}, 'great_secret', {expiresIn:maxAge
    });
}

router.post('/api/signup', async (req, res) => {
    const { username, email, password, passwordRepeat } = req.body;
    try{
        //different passwords
        if (password !== passwordRepeat){
            throw new SyntaxError('different passwords');     
        }
        const user = await User.create({ username, email, password });
        //const token = createToken(user._id);
        //res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        //res.status(201).json({user: isSecureContext._id});
        res.status(201).json(user);
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})


module.exports = router