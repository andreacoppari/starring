const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    Promise.all([
        mongoose.connection.db.collection('movies').find().limit(10).sort({'Staeeing rating': -1}).toArray(),
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
    {layout: 'login'})
})

// @desc    Signup
// @route   GET /signup
router.get('/signup', (req, res) => {
    res.render('signup',
    {layout: 'signup'})
})

// @desc    Film
// @route   GET /film
router.get('/film', (req, res) => {
    console.log("log: "+req.query.search)
    mongoose.connection.db.collection('films').find({"movies": new RegExp('.*' + req.query.search + '.*')}).toArray()
    .then(results => {
        console.log(results)
    })
})

module.exports = router