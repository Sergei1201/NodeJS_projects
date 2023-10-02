const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'

    },
    async (request, accessToken, refreshToken, profile, done) => {
        // Construct a new user
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        // Find a user in MongoDB and compare it with the google user
       try {
        let user = await User.findOne({googleId: profile.id})
        // If the user exists, authenticate him/her, otherwise create a new user based on the google user and save in the database
        if (user) {
            done(null, user)
        } else {
            user = await User.create(newUser)
            done(null, user)
        } 
       } catch (error) {
        console.error(error)
       }
    }
    ))
    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    // Deserialize user
    passport.deserializeUser((obj, done) => {
        done(null, obj)
    })
}