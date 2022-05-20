const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    mongoose.connection.db.collection('films').find().toArray()
    .then(results => {
        res.render('homepage', {content: results})
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

module.exports = router