const nodeMailer = require("../config/nodemailer");

//this is another way of exporting a method
//exports.methodname = function(){};

exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'smw.no.reply@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
        //used arrow function for callback, info carries the info about req that has been sent
    }, (err, info) =>{
        if(err){
            console.log('Error in sending email', err);
            return;
        }

        // console.log("Mail Delivered!", info);
        return;
    })
}



