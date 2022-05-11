const Friendship = require("../models/friendship");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function(req, res){
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
    // Post.find({}).populate('user')
    // // to populate multiple models, use below syntax
    // .populate({
    //     path: "comments",
    //     populate: {
    //         path: "user"
    //     }
    // })
    // .exec(function(err,posts){

    //     User.find({}, function(err, users){
    //         if(err){console.log("error in finding posts");}
    //         return res.render('home', {
    //             title: "Codeial | Home",
    //             posts: posts,
    //             all_users: users
    //     })
    
    //     });

    // })




    // Here our code demands that first execute Post.find query then only, function in call back would call,
//  here inside exec,  then inside exec also, we have User.find, first this would find the data, then only
//   callback function which have return statement would be called.

// So this thing we can do in 3 ways , 1st is what we are already doing , then in 2nd way we can use promises 
// in promises, .then function is called only when promise is successful, so we can keep our call back function
// in .then like below


//using then
// Post.find({}).populate('comments').then(function());

//promises like behaviour with exec

// let posts = Post.find({}).populate('comments').exec();
// posts.then(function())

    try{
        let posts = await Post.find({}).populate('user')
        //for making posts display in reverse chronological order
        .sort("-createdAt")
        // to populate multiple models, use below syntax
        .populate({
            path: "comments",
            populate: {
                path: "user"
            },
            //for populating likes of comments
            populate:{
                path: 'likes'
            }
            // for populating likes of posts
        }).populate('likes');
    
       let users = await User.find({});
       let allFriends = [];

       // here instead of exec .then is used, because, lower function log statements were printing first
       // tried .then and it worked
       if (req.user){

        await Friendship.find({from_user: req.user.id})
        .populate('to_user').then(function(friendships,err){
            if(err){console.log("Error in finding friends", err);}
            if(friendships){
                for(friendship of friendships){
                    allFriends.push(friendship.to_user);
                }
            }
        });

       await Friendship.find({to_user: req.user.id})
        .populate('from_user').then(function(friendships, err){
            if(err){console.log("Error in finding friends", err);}
            if(friendships){
                for(friendship of friendships){
                    allFriends.push(friendship.from_user);
                }
            }
        });


       }
       
        // console.log(allFriends);
    
       return res.render('home', {
        title: "Codeial | Home",
        posts: posts,
        all_users: users,
        all_friends: allFriends
     });

    }catch(err){
        console.log("Error", err);
        return;
    }

 



//  Here async keyword would tell the browser, that this function has some Asynchronus calls,
//   all mongo query calls are asynchronus, 
// Then await keyword would tell ,here we don’t want asynchronus behaviour, instead we would wait
//  for response of this query, then proceed

// Now our code is more clear, readable and short then original code


}



