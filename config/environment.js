require('dotenv').config();

const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, '../production_logs');

//check if log Directory already exits, if not create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// rfs make multiple log files, so when one files grow to the size mentioned in documentation
// it will transder set of logs to another file, and start filling the log file again
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        //not 2 factor authentication
        secure: false,
        auth: {
            user: 'smw.no.reply',
            pass: 'BTbharat@4609'
        }
    },

    google_client_id: "732549295896-3c6774gejs1oshj43gdoqd3cg2da7spm.apps.googleusercontent.com",
    google_client_secret: "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",
    //here add http, not https, it will give error, This site can’t provide a secure connection
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",

    jwt_secret: 'Codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.smw_asset_path,
    session_cookie_key: process.env.smw_session_cookie_key,
    db: process.env.smw_db,
    smtp: {
        service: 'gmail',
        host: process.env.smw_host,
        port: 587,
        //not 2 factor authentication
        secure: false,
        auth: {
            user: process.env.smw_user,
            pass: process.env.smw_pass
        }
    },

    google_client_id: process.env.smw_google_client_id,
    google_client_secret: process.env.smw_google_client_secret,
    //here add http, not https, it will give error, This site can’t provide a secure connection
    google_call_back_url: process.env.smw_google_call_back_url,

    jwt_secret: process.env.smw_jwt_secret,
    
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}


module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);