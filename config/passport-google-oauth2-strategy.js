const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const Post = require('../models/post');
const env = require('./enviornment');

//tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url
    }, 

    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log("Error in google stratagy-passport ", err);
                return;
            }

            console.log(profile);
            //if found set this user to req.user
            if(user){
                return done(null, user);
            }
            else{
                //if not found, create the user and set it to req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log("Error in creating user", err);
                        return;
                    }
                    else{
                        return done(null, user);
                    }
                });
            }
        });
    }
));

module.exports = passport;