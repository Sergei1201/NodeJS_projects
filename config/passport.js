const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

// Create a new google-oauth20 strategy
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        // Pass data from a google account into a new user from the user's schema
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value

        }
        // Find user by ID and match to the google user
       try {
            let user = await User.findOne({googleId: profile.id})
            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
       } catch (error) {
        console.log(error)
        }
    }))
    // Serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    // Deserialize the user
    passport.deserializeUser((obj, done) => {
        done(null, obj)
    })
}