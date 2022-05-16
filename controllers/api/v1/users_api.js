const User = require("../../../models/user");

const jwt = require("jsonwebtoken");

const env = require('../../../config/environment');

// Sign in and create a session for the user
module.exports.createSession = async function(req, res){

    try {

        let user = await User.findOne({email: req.body.email})
        // if user not logged in or password does not match
        if ( !user || user.password != req.body.password){
            return res.json(422,{
                message: "Invalid username or passowrd"
            })
        }

        return res.json(200,{
            message: "Sign in successfull, here is your token, please keep it safe!",
            data: {
                //sign is a function, to which we pass user
                // encrypt with same key 'codeial', as we mentioned it for decryption
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: 100000})
            }
        })

    } catch (err) {
        console.log("******", err);
        return res.json(500,{
            message: "Internal Server Error!"
        })
    }
    
}
