const express = require('express')
const router = express.Router()
const passport = require('passport')

// Authenticate with google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// Authenticate callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
            (req, res) => res.redirect('/dashboard'))


// Logout
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err)
        }
    })
    res.redirect('/')
})

module.exports = router