const express = require("express");

// app variable will have all the functionalities of express, by calling express function and
// assigned it to app variable
const app = express();

const port = 8000;

const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
//for javascript files or any script files
app.set('layout extractScripts', true);


// static files
app.use(express.static("./assets"));

// using express router
app.use("/",require("./routes"));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        // this functionality in below code is called interpolation
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${8000}`);
})