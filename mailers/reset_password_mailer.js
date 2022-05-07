const nodeMailer = require("../config/nodemailer");
const path = require("path");
const crypto = require("crypto");
const ResetPasswordToken = require("../models/resetPasswordToken");
const User = require("../models/user");

//this is another way of exporting a method
//exports.methodname = function(){};

exports.resetPassword = (req, res) => {
    // let resetLink = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'smw.no.reply@gmail.com',
        to: req.body.email,
        subject: "Reset Password Link!",
        html: req.resetLink
        //used arrow function for callback, info carries the info about req that has been sent
    }, (err, info) =>{
        if(err){
            console.log('Error in sending reset password email', err);
            return;
        }

        // console.log("Mail Delivered!", info);
        return;
    })
}



