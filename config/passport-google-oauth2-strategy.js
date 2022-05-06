const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
// tell passport to use a new strategy to google login
passport.use(new googleStrategy({
    
    clientID: "732549295896-3c6774gejs1oshj43gdoqd3cg2da7spm.apps.googleusercontent.com",
    clientSecret: "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",
    //here add http, not https, it will give error, This site can’t provide a secure connection
    callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
// it is call back function, it takes accesstoken, it is similar to jwttoken being sent in headers, similarly
// google also generates an accesstoken and send to us, now if our accesstoken expires we use refresh token
// to get new accesstoken, profile would contain users info, we are going to match
// user in our databse, done is callback function
    function(accessToken, refreshToken, profile, done){
        // find a user
        // google can give multiple email accounts, user may logged in with many emails
        //now we are just testing so choose first email
        // email may have many fields, so choose .value
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in google-strategy passport', err); return;}

            console.log(profile);
            //if user found, sigin, set this as req.user for views
            if(user){
                // error is null
                return done(null,user);
            }else{
                //if user not found, make account , signUp
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }, function(err, user){
                    if(err){console.log('error in creating user', err); return;}

                    return done(null, user);
                })
            }
        })
    }
))


module.exports = passport;