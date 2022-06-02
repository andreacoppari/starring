const express = require('express')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const Movie = require('./models/Movie')
const Review = require('./models/Review')
const jwt = require('jsonwebtoken')
const { query } = require('express')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')

//import {BrowserRouter, Routes, Route} from 'react-router-dom';
//const useCookie = require('react-cookie')

//require('dotenv').config
// da mettere in .env
const sec = '911284b06459b85fb9d285183b10de52f16a871f83f2a174a230297106ab264c6467a97503cad712e5f6c81268bc5cb3773b92af74eb371999e23c1f823eb8cf'

app.use(cors())
app.use(express.json())
app.use(cookieParser())

mongoose.connect('mongodb+srv://starring-admin:§T4rr1ng@starring.7dedo.mongodb.net/test')

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username: '', email: '', password: '', passwordR: ''};
    errors.message='unknown'

    //validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    else if(err.message === 'weak password'){
        errors.password='Password must contain at least one number, one lowercase and one uppercase letter'
    }

    //duplicate error code
    else if (err.code === 11000){
        errors.email = 'This email is already registered';
    }

    else if(err.message === 'WP'){
        errors.password='Wrong password'
    }

    else if(err.message === 'IE'){
        errors.email='Invalid mail'
    }

    else if(err.message === 'different passwords'){
        errors.passwordR = 'The passwords must be the same';
    }
    return errors;
}

const maxAge = 60 * 60
const createToken = (id) => {
    //return jwt.sign({id}, sec, {expisesIn: maxAge});
    return jwt.sign({id}, sec);
}

app.post('/api/register', async (req, res) => {
    try {
        if (req.body.password !== req.body.passwordR){
            throw new SyntaxError('different passwords');     
        }
        let password = req.body.password;
        var cont = 0
        for(let index = 0; index<password.length; index++){
            if(password[index]>='a'&&password[index]<='z'&&cont<100 ){
                 cont += 100;
            }
            if(password[index]>='A'&&password[index]<='Z' &&cont%100<10){
                cont += 10;
            }
            if(password[index]>='0'&&password[index]<='9'&&cont%10<1 ){
                cont += 1;
            }
        }
        if (cont < 111){
            throw new SyntaxError('weak password');     
        }
        
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        /*const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})*/
        res.json({ status: 'ok', user: user._id })
    } catch (err) {
        const errors = handleErrors(err);
        res.json({ errors });
    }
})

login = async function(email, password){
    const user = await User.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('WP')
    }
    throw Error('IE')
}

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await login(email, password);
        const token = createToken(user._id)
        console.log("weeeeeeeeeeeeeeeeeeeeee3")
        //res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.cookie('jwt', token)
        res.json({ status: 'ok', user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.json({ errors });
        /*
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if (user) {
        moderate = user.email == 'ciao'
        const token = jwt.sign({
            username: user.username,
            email: user.email,
            mod: moderate
        }, secret)
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })*/
    }
})
/*
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, sec, (err,user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}*/


app.get('/api/user', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        
        return res.json({ status: 'ok', user: decoded })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
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
        const decoded = jwt.verify(token, sec)
        const email = decoded.email
        const user = await User.findOne({ email: email })

        // Return from database all titles and covers of movies
        const movies = await Movie.find({}, {title:1, cover:1})
        var watchlist = []
        // Find every movie which has the same title as the movies inside user.watchlist and put them inside array watchlist
        for(let i=0; i<user.watchlist.length; i++){
            watchlist.push(movies.find(element => element.title == user.watchlist[i]))
        }
        // Return watchlist
        return res.json({ status: 'ok', watchlist: watchlist})
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

// Per il futuro ;)
app.post('/api/watchlist', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, sec)
        const email = decoded.email

        var user = await User.findOne({ email: email })
        // Check if film is already inside watchlist
        if(user.watchlist.includes(req.body.watchlist)){
            //Remove from watchlist
            await User.updateOne(
                {email: email},
                {$pull: {watchlist: req.body.watchlist}})
            res.json({ status: 'ok', watchlist: req.body.watchlist, msg: ' removed from your watchlist.' })
            return;
        }
        //Add to watchlist
        user = await User.updateOne(
            { email: email },
            { $push: { watchlist: req.body.watchlist } })

        return res.json({ status: 'ok', watchlist: req.body.watchlist, msg: ' added to your watchlist.'})
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/addreview', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, secret)
        const newReview = await Review.create(
            {
                movie: req.body.movie,
                review: req.body.review,
                user: decoded.username,
                email: decoded.email })
        const addReviewToMovie = await Movie.updateOne(
            { title: req.body.movie },
            { $push: { reviews: req.body.review } })
        const addReviewToUser = await User.updateOne(
            { email: decoded.email },
            { $push: { reviews: req.body.review } })

        return res.json({ status: 'ok', review: req.body.review })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

// --- *** MODERATOR APIS *** ---

app.get('/api/reviews', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        if(decoded.mod == false) throw ''

        const reviews = await Review.find({}).sort({'createdAt': -1})
        
        return res.json({ status: 'ok', reviews: reviews })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/removereviews', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, secret)
        if(decoded.mod == false) throw ''

        const users = []
        req.body.reviews.forEach(review => {
            const user = User.updateOne(
                { email: review.email },
                { $pull: { reviews: review._id } })
            users.push(user)
        })

        const reviews = await Review.deleteMany(
            { _id: { $in : req.body.reviews} })
        console.log(reviews)
        return res.json({ status: 'ok', reviews: reviews })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.listen(1234, () => {
    console.log('Starring is online on http://localhost:1234')
})

