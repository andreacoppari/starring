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
    {layout: 'login'
    })
})

module.exports = router