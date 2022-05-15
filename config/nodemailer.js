const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs"); 

const env = require("./environment")
let transporter = nodemailer.createTransport(env.smtp);


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