const express = require("express");

// app variable will have all the functionalities of express, by calling express function and
// assigned it to app variable
const app = express();

const port = 8000;

// using express router
app.use("/",require("./routes"))

app.listen(port, function(err){
    if(err){
        // this functionality in below code is called interpolation
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${8000}`);
})