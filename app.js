const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

// Config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

// Initialize express
const app = express()
// Middleware

// Use morgan if in the development mode
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('short'))
}

// Handlebars
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))

connectDB()
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 
