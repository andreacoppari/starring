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
router.get('/film', (req, res) => {
    console.log("log: "+req.query.search)
    mongoose.connection.db.collection('films').find({"title": new RegExp('.*' + req.query.search + '.*')}).toArray()
    .then(results => {
        console.log(results)
    })
})

module.exports = router