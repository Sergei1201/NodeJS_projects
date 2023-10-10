const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

// Config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

// Initialize express
const app = express()

// Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Use morgan if in the development mode
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('short'))
}

// Handlebars helpers
const {formatDate, truncate, stripTags, editIcon} = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({helpers: {
  formatDate,
  truncate,
  stripTags,
  editIcon},
  defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
  
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Global variables middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

connectDB()
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 
