const passport = require("passport");
const { findOneAndUpdate } = require("../models/user");
const LocalStrategy = require('passport-local').Strategy;

const User = require("../models/user");

//Authentication using passport
passport.use( new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    //done is function inbuild in passport
    function(req, email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                // console.log("Error in fiding user --> Passport");
                req.flash("error", err);
                return done(err);
            }

            if( !user || user.password != password){
                // console.log("Invalid Username/Password");
                req.flash("error", "Invalid Username/Password");
                // done take two arguments first is err, here no err, so null, second is authentication true 
                // or false
                return done(null, false);
            }

            done(null, user);
        })

    }
));


// seriallizing the use to decide which key is to be kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//deserializing the user by taking key in the cookies

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log("Error in fiding user --> Passport");
            return done(err); 
        }

        return done(null, user);
    })
})

//first use would login, Once the user is found and authenticated we serialize the user means decide
// which property is to be sent to cookie and the cookie is sent to browser automatically in the 
// response and when the next request comes in we need to deserialize it means we need to find which user
// is signed in and making the request 


//when the user signs in we find the id, send it to the cookie, and the cookie sent to the browser
// now browser makes a request, so we deserialize it and find the user again 




// for sending data of signed in user to views
//check if user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending
        //this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}



module.exports = passport;