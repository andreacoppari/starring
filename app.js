const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const { send } = require('process')
const cookieParser = require('cookie-parser');


// load config
dotenv.config({ path: './config/config.env' })

// passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}
// handlebars
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: ".hbs"}))
app.set('view engine', '.hbs')

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static
app.use(express.static(path.join(__dirname, 'public')))

//middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

//cookie
app.get('/set_cookie', (req,res) => {
    res.cookie('newUser', true, {httpOnly: true/*, secure:true*/});
    send('cookie taken');
})

/*app.get('/read_cookies', (req,res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
})*/

const PORT = process.env.PORT || 8000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)