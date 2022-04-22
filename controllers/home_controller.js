const Post = require("../models/post");

module.exports.home = function(req, res){
    // return res.end('<h1> Express is up for codeial </h1>');
    //to print cookies, we can add cookies manually in chrome 
    //developer tools > Applications Tab > Cookie
    // console.log(req.cookies);

    //We can also change the value of cookie, while sending response from server
    // res.cookie('user_id', 25);


    // Post.find({}, function(err,posts){
    //     if(err){console.log("error in finding posts");}

    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });

    // })


    // Now if we want to print related user also alongside posts, we can add tag this below tag inside li tag above


    // <small>
    //     <%= post.user %>
    // </small>
    
    // but this will show only user id not user name or other details, actually our post schema has
    // user value as user id only , so to show user name what we do is when we are fetching all the posts in home_controller.js ,we would prepopulte the user property of post schema, means 
    // all the post now will have full user details , not only user id , as per original schema
    
    





    // it means populate the 'user' property, when we have long query
    // we can also write callback function in exec
    Post.find({}).populate('user')
    // to populate multiple models, use below syntax
    .populate({
        path: "comments",
        populate: {
            path: "user"
        }
    })
    .exec(function(err,posts){
        if(err){console.log("error in finding posts");}

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts 
        });

    })



}
