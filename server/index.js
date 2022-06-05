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
<<<<<<< HEAD
=======
//const cookieParser = require('cookie-parser')
>>>>>>> feature/testing

//mod pw:Moderatore0
//require('dotenv').config
// da mettere in .env
const secret = '911284b06459b85fb9d285183b10de52f16a871f83f2a174a230297106ab264c6467a97503cad712e5f6c81268bc5cb3773b92af74eb371999e23c1f823eb8cf'

app.use(cors())
app.use(express.json())
<<<<<<< HEAD
=======
//app.use(cookieParser())
>>>>>>> feature/testing

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

/*const maxAge = 60 * 60
const createToken = (id, mod) => {
    //return jwt.sign({id}, sec, {expiresIn: maxAge});
    return jwt.sign({id, mod}, secret);
}*/

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
            throw Error('weak password');     
        }
        
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({ status: 'ok', user: user._id })
    } catch (err) {
        const errors = handleErrors(err);
        res.json({ errors });
    }
})

app.post('/api/delete', async (req, res) => {
    const email = req.body.email;
    await User.findOneAndDelete({email});
    res.json({ status: 'ok'})
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
        moderate = user.email == 'mod@mod.it'
        const token = jwt.sign({
            username: user.username,
            email: user.email,
            mod: moderate
        }, secret, {expiresIn: '1h'})
        res.json({ status: 'ok', user: token })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.json({ errors });
    }
})

app.get('/api/user', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, secret)
        
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
        const exp = new RegExp(req.query.search, 'i')
        const movie = await Movie.find(
            { $or: [ {'title': exp}, {'genres': exp} ] },
            { reviews:0 }
            )
        // Check if it found a movie
        if(movie.length > 0)
            return res.json({ status: 'ok', movie: movie })
        return res.json({ status: 'error', error: 'movies not found'})
    } else {
        return res.json({ status: 'error', error: 'movies not found'})
    }
})

app.get('/api/movies/:id', async (req, res) => {
    const movie = await Movie.findOne({'title': new RegExp(req.params.id)})
    
    return res.json({ status: 'ok', movie: movie })
})

app.get('/api/watchlist', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, secret)
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

app.post('/api/watchlist', async (req, res) => {
    const token = req.headers['x-access-token']
    if(token == "null"){
        return res.json({ status: 'error', error: "Devi essere loggato per usare la watchlist!" })
    }
    try {
        const decoded = jwt.verify(token, secret)
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
    if(token == "null")
        return res.json({ status: 'error', error: "Devi essere loggato per usare la watchlist!" })
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
        const decoded = jwt.verify(token, secret)
        if(decoded.mod == false) throw ''

        const reviews = await Review.find({})
        
        return res.json({ status: 'ok', reviews: reviews.reverse() })
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

        const rmMovies = []
        const rmUsers = []
        const rmReviews = []

        for(let i=0; i < req.body.reviews.length; i++) {
            const review = req.body.reviews[i]

            const rmMovie = await Movie.updateOne(
                { title: review.movie },
                { $pull: { reviews: review.review } })
            rmMovies.push(rmMovie)

            const rmUser = await User.updateOne(
                { email: review.email },
                { $pull: { reviews: review.review } })
            rmUsers.push(rmUser)

            const rmReview = await Review.deleteOne({ $or: [
                { _id: review._id },
                { email: review.email, review: review.review } ]})
            rmReviews.push(rmReview)
        }
        
        return res.json({ status: 'ok', reviews: req.body.reviews })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.listen(1234, () => {
    console.log('Starring is online on http://localhost:1234')
})

module.exports = app;
