const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_ID,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
    }
    ))
    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id) 
    })
    
    // used to deserialize the user
   
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })   
}
