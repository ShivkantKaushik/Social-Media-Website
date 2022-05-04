const User = require("../models/user.js");
//fs means filesystem, it would be helpful in deleting file
const fs = require("fs");
//path, where file should be deleted
const path = require('path');

module.exports.profile = function (req, res){

    User.findById(req.params.id, function(err, user){
        // res.end("<h1>User Profile</h1>");
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    })

    
}


module.exports.update = async function(req, res){
    //to check user that is logged in, only he is updating the profile
    // if(req.user.id == req.params.id){
    //     //we can also replace req.body by {name: req.body.name, email: req.body.email}
    //     // but req.body is exactly that json object what we have to update so below code
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect("back");
    //     })

    // }else{
    //     return res.status(401).send("Unautherized");
    // }


    if(req.user.id == req.params.id){

        try{
            let user = await User.findByIdAndUpdate(req.params.id);
            // but our this form enctype is multipart, wo we would not be able to access form values
            // by req.body.something normally, we would be using multer and pass the req to function below
            // then inside that function we can use req.body.something
            User.uploadedAvatar(req, res, function(err){
            if(err){ console.log("******Multer Error", err);  }
            // console.log(req.file);
            user.name = req.body.name;
            user.email = req.body.email;
            // to check if there is file, means run below code only when user uploads, not all the time
            if(req.file){
                // if there is already a profile picture
                if(user.avatar){
                    let dpPath = path.join(__dirname,'..', user.avatar);
                    // what if user already have DP, but we delete DP from database, what it would delete
                    // so we should check user have avatar, as well as there is a file in database
                    if (fs.existsSync(dpPath)) {
                        // delete older file, older DP
                    fs.unlinkSync(dpPath);
                      } else {
                        console.log("DOES NOT exist:", dpPath);
                      }


                }


                // this is saving the path of uploaded file in the database, in avatar field of userSchema
                //req.file.filename gives file name
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }

            user.save();
            return res.redirect("back");
            
            });
        }catch(err){
            req.flash('error',err);
            res.redirect("back");
        }

    }else{
        req.flash('error', "Unauthorized");
        res.status(401).send("Unauthorized");
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
    //first argument is type of flash message, we can give anything xyz
    req.flash('success', "Logged in Successfully");
    return res.redirect("/");
}


module.exports.destroySession = function(req, res){
    // this logout function is in passport
    req.logout();
    req.flash('success', "You have logged out!");
    return res.redirect("/");
}

