const Comment = require("../models/comment");
const Post = require("../models/post")

module.exports.create = function(req,res){
    //name of the input is post , in comments form
    Post.findById(req.body.post, function(err,post){
        //if post exists
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err,comment){
                //handle error

                //update the comment in the post
                post.comments.push(comment);
                post.save();

                res.redirect("/");
            })
        }
    })
}