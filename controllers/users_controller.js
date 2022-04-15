const User = require("../models/user.js");

module.exports.profile = function (req, res){
    // res.end("<h1>User Profile</h1>");
    return res.render('user_profile', {
        title: "User Profile"
    });
}

module.exports.signup = function(req,res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

module.exports.signin = function(req,res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

//get the signup data
module.exports.create = function(req,res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect("back");
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){ console.log("Error in finding user in signing up"); return }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){ console.log("Error in creating user while signing up"); return }
                
                return res.redirect("/users/sign-in");
                
            })
        }else{
            // if user is already existing
            return res.redirect("back");
        }

    })
    
}

// Sign in and create a session for the user
module.exports.createSession = function(req, res){
    //
}
