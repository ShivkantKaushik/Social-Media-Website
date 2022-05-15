const express = require("express");

const env = require("./config/environment");


const logger = require("morgan");
// app variable will have all the functionalities of express, by calling express function and
// assigned it to app variable
const app = express();
//Helpers are basically functions which, can be used in views by passing them to locals.
require('./config/view-helpers')(app);

const port = 8000;

const expressLayouts = require("express-ejs-layouts");

const cookieParser = require("cookie-parser");

const db = require("./config/mongoose.js");

//used for session cookie
const session = require('express-session'); 
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");

const sassMiddleware = require("node-sass-middleware");

const flash = require("connect-flash");

const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000");



const path = require("path");

if(env.name == 'development'){
    //put this just before server starts, because we need these files to be precompiled just before the
// server starts,so whenever browsers asks for the files we can give
app.use(sassMiddleware({
    // from where I would pick scss files
    //add dot befor first slash, otherwise would not compile
    src: path.join(__dirname, env.asset_path, 'scss'),
    //where do I need to put compiled css files back
    dest: path.join(__dirname, env.asset_path, 'css'),
    // do I want to show error, while compiling, In production we give False 
    debug: true,
    // do I want everything to be in multiple lines(expanded) or in single line
    outputStyle: 'expanded',
    // where do server look for initial css files
    prefix: "/css"
}))

}


// reading through the post requests
app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
//for javascript files or any script files
app.set('layout extractScripts', true);

// static files
app.use(express.static(env.asset_path));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// for logs in production and development 
app.use(logger(env.morgan.mode, env.morgan.options));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in db
app.use(session({
    name: 'Codeial',
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    // when the session is not intialized, means user is not logged in do we want to save 
    // the extra data in the session cookie, no, so false
    saveUninitialized: false,
    // if the session is intialized already, means there is some sort of data in the session cookie
    // do I want to rewrite it, if there is no change, no , so false
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial_development',
        mongooseConnection: db,
        autoRemove: 'disabled'},
    function(err){
        console.log(err || "connect-mongo setup ok");
    })
}));

app.use(passport.initialize());
app.use(passport.session());
//whenever app is getting intialized, passport is also getting intialized and this below function
// is called, it will check whether if session cookie is present or not, means this middleware
// setAuthenticatedUser in passport-local-stategy is called, and it will set user in the locals
// and the user should be accessible in views
app.use(passport.setAuthenticatedUser);

app.use(flash());

app.use(customMware.setFlash);

// using express router
app.use("/",require("./routes"));



app.listen(port, function(err){
    if(err){
        // this functionality in below code is called interpolation
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${8000}`);
})