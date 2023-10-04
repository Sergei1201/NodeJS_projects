const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// Stories route
router.get('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
        
    } catch (error) {
        console.error(error)
        res.render('errors/500')
        
    }

// Stories add route
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

})
module.exports = router
