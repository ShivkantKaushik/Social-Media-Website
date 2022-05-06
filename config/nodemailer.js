const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs"); 


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    //not 2 factor authentication
    secure: false,
    auth: {
        user: 'smw.no.reply',
        pass: 'BTbharat@4609'
    }
})


let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        // relative path is from where this function is being called
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        // callback function
        function(err, template){
            if (err) {console.log("Error in rendering template", err); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}