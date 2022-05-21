const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const mongoose = require('mongoose');


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
    console.log("film_id: "+req.params.id);
    mongoose.connection.db.collection('films').find({"id": new RegExp(req.params.id)}).toArray()
    .then(results => {
        console.log(results);

        // Check if there is at least one film in database, if not redirect to homepage
        if(results.length > 0)
            res.render('film', {layout: 'film', film: results})
        else
            res.redirect('/')
    })
})

module.exports = router