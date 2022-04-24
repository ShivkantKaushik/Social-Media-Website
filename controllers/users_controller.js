const User = require("../models/user.js");

module.exports.profile = function (req, res){

    User.findById(req.params.id, function(err, user){
        // res.end("<h1>User Profile</h1>");
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    })

    
}


module.exports.update = function(req, res){
    //to check user that is logged in, only he is updating the profile
    if(req.user.id == req.params.id){
        //we can also replace req.body by {name: req.body.name, email: req.body.email}
        // but req.body is exactly that json object what we have to update so below code
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect("back");
        })

    }else{
        return res.status(401).send("Unautherized");
    }
}

module.exports.signup = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

module.exports.signin = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }

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
    return res.redirect("/");
}


module.exports.destroySession = function(req, res){
    // this logout function is in passport
    req.logout();

    return res.redirect("/");
}