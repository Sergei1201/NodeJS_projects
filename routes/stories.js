const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// Add Story (GET)
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// Edit Story (GET)
router.get('/edit/:id', ensureAuth, async (req, res) => {
    // Match the database user against the URL user
    let story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if (!story) {
        return res.render('errors/404')
    }
    if (story.user != req.user._id) {
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story
        })
        console.log(story)
    }
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
