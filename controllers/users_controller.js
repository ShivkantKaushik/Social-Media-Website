const User = require("../models/user.js");
//fs means filesystem, it would be helpful in deleting file
const fs = require("fs");
//path, where file should be deleted
const path = require('path');
const ResetPasswordToken = require("../models/resetPasswordToken");

const resetPasswordMailer = require("../mailers/reset_password_mailer");

const crypto = require("crypto");


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

module.exports.forgotPassword = function(req,res){
    return res.render('forgotPassword',{
        title: "Forgot Password"
    });
}

// here async await because User.findOne is asynchronus call, so if user not exist, control will
//go further then, whom to send mail
// also if we are using async await we can't use callback in user.finone, because if would be mix of promises and
// callbacks,and will give error, so we have to use .then here, 
//and in .then ,first argument would be user found , second argument will be error
// also we are finding user and making token here only, so that we can use noty and show notification if 
// user not exist, if we write this code in reset_password_mailer, then noty is not available there 
module.exports.resetPassword = async function(req,res){
   await User.findOne({email: req.body.email}).then(function(user, err){
        if(err){console.log("Error in finding user", err);}
        if(user){
            let token = crypto.randomBytes(20).toString('hex');
            ResetPasswordToken.create({
                user: user,
                token: token,
                valid: true
            },function(err,rptObject){
                if(err){ console.log("Error in creating reset password token object", err);}
            });
            req.resetLink = '<p>Click <a href="http://localhost:8000/reset-password/' + token + '">http://localhost:8000/reset-password/' + token + '</a> to reset the password.</p>';
        }else{
            req.flash("error", "User doesn't exist, Please sign up!");
            return res.redirect("/users/sign-up");
        }

    });
    resetPasswordMailer.resetPassword(req);
    req.flash("success", "Password Reset link is sent");
    return res.redirect("/users/sign-in");
}

// async await, because if control go to res.render and token is invalid, link can be reused to change
// the password
module.exports.updatePassword = async function(req,res){
    // when using .then , use err as second argument
    //also if we are using async await we can't use callback in user.finone, because if would be mix of promises and
// callbacks,and will give error, so we have to use .then here, 
    await ResetPasswordToken.findOne({token: req.params.id}).then(function(token, err){
        console.log(token);
        if(err){console.log("Error in finding token", err);}
        if(token.valid == false){
            req.flash("error", "Reset Password Link Got Expired, Please again click on Forgot Password!");
            return res.redirect("/users/sign-in");
        }
    })
   return  res.render('updatePassword',{
        title: "Update Password",
        tokenForResettingPassword: req.params.id
    })
}

module.exports.postReqToUpdatePassword = function(req,res){
    ResetPasswordToken.findOne({token: req.body.token}, function(err,token){
        if(err){
            // if error in finding token, anyway we would say to user, link got expired
            console.log("error in finding token", err);
            req.flash("error", "Reset Password Link Got Expired, Please again click on Forgot Password!");
            return res.redirect("/users/reset-password");
        }else{
            // reset the password
            if (req.body.password == req.body.confirmPassword){
                
                    // here simply token.user.id didn't came in string format
                    User.findByIdAndUpdate(token.user._id.toString(), {password: req.body.password}, function(err,user){
                        if(err){console.log("Error in resetting password", err);}
                    });
                    req.flash("success", "Your password is reset now!");
                    ResetPasswordToken.findByIdAndUpdate(token._id.toString(), {valid: false}, function(err,user){
                        if(err){console.log("Error in updating token validness", err);}
                    });
                    return res.redirect("/users/sign-in");
            }else{
                req.flash("error", "Passwords doesn't match");
                return res.redirect("/reset-password/" + req.params.id);
            }
           
        }
    })
}