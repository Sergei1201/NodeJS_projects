const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
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

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Use morgan if in the development mode
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('short'))
}

// Handlebars helpers
const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({helpers: {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select},
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
