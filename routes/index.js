const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    res.render('homepage')
})

// @desc    Homepage
// @route   GET /home
router.get('/login', (req, res) => {
    res.render('login',
    {layout: 'login'
    })
})

// @desc    Signup
// @route   GET /signup
router.get('/signup', ensureGuest, (req, res) => {
    res.render('signup')
})

module.exports = router