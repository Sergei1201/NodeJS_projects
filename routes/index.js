const express = require('express')

const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Story = require('../models/Story')

// Get requests
// Login
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {layout: 'login'})
})

// Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({user: req.user._id}).lean()
        res.render('dashboard', {
            user: req.user.firstName,
            stories
        })
        console.log(req.user.firstName)
        
    } catch (error) {
        console.error(error)
        res.render('errors/505')        
    }
    })


module.exports = router