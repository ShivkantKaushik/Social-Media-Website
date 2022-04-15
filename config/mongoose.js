const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;

// if there is an error in connecting to database, it would display "Error connecting to MongoDB"
// in console
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log("Connected to Database: MongoDB");
})

module.exports = db;