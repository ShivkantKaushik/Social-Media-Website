const passport = require("passport");
const JWTStrategy = require('passport-jwt').Strategy;
// a module to extract jwt from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const env = require('./environment');


// header is a list of key, that list has one key authorisation,this also has list,in this one key is bearer
// this bearer will have JWT Token, ExtractJWT.fromAuthHeaderAsBearerToken, this will extract that token
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // key to encrypt
    secretOrKey: env.jwt_secret,
}
// function in this will reads the data from jwt payload, remember jwt had three parts,header, payload
// and signature, this payload will contain the info of user, done is callback function 
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id, function(err, user){
        if(err){ console.log('Error in findin user from JWT'); return;}

        if(user){
            // error would be null
            return done(null, user);
        }else{
            // false means user was not found
            return done(null, false);
        }
    })

}))


module.exports = passport;