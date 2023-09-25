const express = require('express')

const router = express.Router()

// Get requests
// Login
router.get('/', (req, res) => {
    res.render('login', {layout: 'login'})
})

// Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})


module.exports = router