module.exports.home = function(req, res){
    // return res.end('<h1> Express is up for codeial </h1>');
    //to print cookies, we can add cookies manually in chrome 
    //developer tools > Applications Tab > Cookie
    console.log(req.cookies);

    //We can also change the value of cookie, while sending response from server
    res.cookie('user_id', 25);

    return res.render('home', {
        title: "Home"
    });
}
