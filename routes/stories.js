const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// Add Story (GET)
router.get('/add', ensureAuth, (req, res) => {
    try {
        res.render('stories/add')
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// Edit Story (GET)
router.get('/edit/:id', ensureAuth, async (req, res) => {
    // Match the database user against the URL user
    try {
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
        }
    }
    catch (error) {
        console.error(error)
        res.render('errors/404')
    }
}
    )

// Get Single Story
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        // Find Story By ID
        let story = await Story.findById({_id: req.params.id})
                    .populate('user')
                    .lean()
        if (!story) {
            return res.render('errors/404')
        }
        
        // Make sure that the user owns a particular story and the story is not private to show
        if (story.user != req.user._id && story.status == 'private') {
            res.render('errors/404')
        } else {
            res.render('stories/show', {
                story
            })
            console.log(story)
        }
        
    } catch (error) {
        console.error(error)
        res.redirect('/stories')
        
    }

})

// Get All User's Stories
router.get('/user/:userID', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({user: req.params.userID, status: 'public'})
                                        .populate('user')
                                        .lean()
        if (!stories) {
            return res.render('errors/404')
        } else {
            res.render('stories/index', {
                stories
            })
        }
        
    } catch (error) {
        console.error(error)
        res.render('/dashboard')
        
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

// Update Story (PUT)
router.put('/:id', ensureAuth, async (req, res) => {
    try {

    // Find a story from DB that matches the story from the URl
        let story = await Story.findById({_id: req.params.id}).lean()
        if (!story) {
            return res.render('errors/404')
        }
    // Make sure that the user owns theri story in order to update it
        if (story.user != req.user._id) {
            res.redirect('/stories')
        } else {
    // Find the story by ID and update
            story = await Story.findByIdAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.redirect('errors/500')
    }
})
        
// Delete Story (DELETE)
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        // Find by ID in the database and remove
        await Story.findByIdAndRemove({_id: req.params.id})
        res.redirect('/dashboard')
        
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})
   


module.exports = router
