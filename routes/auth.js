const express = require('express')
const router = express.Router()
const passport = require('passport')

// Authenticate with google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// Authenticate callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
            (req, res) => res.redirect('/dashboard'))


module.exports = router