const express = require('express')
const dotenv = rewuire('dotenv')

//load
dotenv.config({ path: '.config/config.env' })

const app = express()

const PORT = process.env.PORT || 1234

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)