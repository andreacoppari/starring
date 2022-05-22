const express = require('express')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const Movie = require('./models/Movie')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://starring-admin:§T4rr1ng@starring.7dedo.mongodb.net/react')

app.post('/api/register', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if (user) {

        const token = jwt.sign({
            username: user.username,
            email: user.email   
        }, 'secret123')
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
    
})

app.get('/api/movies', async (req, res) => {
    const movies = await Movie.find().toArray()

    if (movies.length > 0) {
        return res.json({ status: 'ok', movies: movies })
    } else {
        return res.json({ status: 'error', error: 'movies not found' })
    }
})

app.get('/api/watchlist', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return { status: 'ok', watchlist: user.watchlist }
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

// Per il futuro ;)
app.post('/api/watchlist', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.updateOne(
            { email: email },
            { $push: { watchlist: req.body.watchlist } })

        return res.json({ status: 'ok', watchlist: req.body.watchlist })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.listen(1234, () => {
    console.log('Starring is online on http://localhost:1234')
})
