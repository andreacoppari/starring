const express = require('express')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const Movie = require('./models/Movie')
const jwt = require('jsonwebtoken')
const { query } = require('express')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://starring-admin:§T4rr1ng@starring.7dedo.mongodb.net/test')

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username: '', email: '', password: ''};
    errors.message='unknown'

    //duplicate error code
     if (err.code === 11000){
         errors.message = 'This email is already registered';
         return errors;
     }

     if(err.message === 'different passwords'){
        errors.message = 'The passwords must be the same';
        return errors;
     }
    //validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors.message = properties.message;
        });
    }
    return errors;
}

app.post('/api/register', async (req, res) => {
    try {
        if (req.body.password !== req.body.passwordR){
            throw new SyntaxError('different passwords');     
        }
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({ status: 'ok' })
    } catch (error) {
        const errors = handleErrors(error);
        res.json({ status: 'error', message: errors.message })
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

app.get('/api/recommended', async (req, res) => {
    const movies = await Movie.find({}, {title:1, cover:1}).limit(15).sort({'Starring rating': -1})

    if (movies.length > 0) {
        return res.json({ status: 'ok', movies: movies })
    } else {
        return res.json({ status: 'error', error: 'movies not found' })
    }
    
})

app.get('/api/newfilm', async (req, res) => {
    const movies = await Movie.find({}, {title:1, cover:1}).limit(15).sort({'year': -1})

    if (movies.length > 0) {
        return res.json({ status: 'ok', movies: movies })
    } else {
        return res.json({ status: 'error', error: 'movies not found' })
    }
    
})


app.get('/api/search', async (req, res) => {
    if(req.query.search){
        const movie = await Movie.find({'title': new RegExp(req.query.search)})
        return res.json({ status: 'ok', movie: movie })
    } else {
        return res.json({ status: 'error', error: 'movies not found' })
    }
})

app.get('/api/movies/:id', async (req, res) => {
    const movie = await Movie.findOne({'title': new RegExp(req.params.id)})
    
    return res.json({ status: 'ok', movie: movie })
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
