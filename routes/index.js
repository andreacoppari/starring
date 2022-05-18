const express = require('express')
const router = express.Router()

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    res.render('homepage')
})

// @desc    Homepage
// @route   GET /home
router.get('/login', (req, res) => {
    res.render('login',
    {layout: 'login'})
})

router.get('/signup', (req, res) => {
    res.render('signup',
    {layout: 'login'})
})

module.exports = router