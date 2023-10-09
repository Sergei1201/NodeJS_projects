const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// Add Story (GET)
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// Add Story (POST)
router.post('/', ensureAuth, async (req, res) => {
    try {
        // Create a story and save it to MongoDB
        req.body.user = req.user._id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }
    catch (error) {
        console.error(error)
        res.render('errors/500')
        
    }

})
// Get Public Stories
router.get('/', ensureAuth, async (req, res) => {
    // Fetch public stories from DB and pass them to template
    try {
        let stories = await Story.find({status: 'public'})
                        .populate('user')
                        .sort({createdAt: 'desc'})
                        .lean()
        res.render('stories/index', {
            stories
        })
        
    } catch (error) {
        console.error(error)
    }
})


module.exports = router
