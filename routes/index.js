const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const mongoose = require('mongoose');
const Handlebars = require('handlebars')


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
// Render the search page
router.get('/search', (req, res) => {
    res.render('search', {layout: 'search'})
})

// @desc    Load
// @route   GET /load
// Returns all films contained in database
router.get('/load', (req, res) => {
    mongoose.connection.db.collection('movies').distinct('title')
    .then(results => {
        res.status(200).json({
            self: '/load',
            film: results
        });
    })
})
// @desc    Load
// @route   GET /load/:id
// Return film with similar title as the value contained in :id
router.get('/load/:id', (req, res) => {
    mongoose.connection.db.collection('movies').distinct('title', { title: new RegExp(req.params.id)})
    .then(results => {
        res.status(200).json({
            self: '/load/'+req.params.id,
            film: results
        });
    })
})

// @desc    Movies
// @route   GET /movies
router.get('/movies', (req, res) => {
    res.status(400).send()
    console.log('Non è stato selezionato un film')
})
// @desc    Movies
// @route   GET /movies/:id
router.get('/movies/:id', (req, res) => {
    mongoose.connection.db.collection('movies').find({"title": new RegExp(req.params.id)}).limit(1).toArray()
    .then(results => {
        if(results.length > 0) {
            res.status(200).json({
                self: '/movies/' + results[0].title,
                title: results[0].title,
                year: results[0].year,
                cast: results[0].cast,
                starring_rating: results[0]['Starring rating'],
                imdb_rating: results[0].rating,
                genres: results[0].genres,
                plot: results[0].plot,
                cover: results[0].cover,
                reviews: results[0].reviews
            });
        } else {
            res.status(404).json({
                self: '/movies/'+req.params.id
            })
            console.log('Film inesistente')
        }
    })
})

// @desc    Film
// @route   GET /film/:id
router.get('/film/:id', (req, res) => {
    res.render('film', {layout: 'film'})
})

Handlebars.registerHelper('limit', function(arr, limit) {
    if (!Array.isArray(arr)){ return [];}
    return arr.slice(0, limit);
});

Handlebars.registerHelper('commentToTitle', function(string) {
    if (string.length > 50){ return string.slice(0, 40) + "...";}
    return string;
});

module.exports = router