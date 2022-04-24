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

module.exports.destroy = function(req, res){
    //populating post so that we can get comment.post.user, and compare it with who logged in 
    // so that user who owns the post can also delete the comment
    Comment.findById(req.params.id).populate("post").exec(function(err, comment){
        //if user who commented equals to who logged in OR who owns the post equals to who logged in 
        if (comment.user == req.user.id || comment.post.user == req.user.id){
            //comment.post give post id in string
            let postId = comment.post;

            comment.remove();
            // mongoose syntax to pull out the comment id from list of comments
            // pull(delete) comment with req.params.id from comments of post related to postId
            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err,post){
                return res.redirect("back");
            })

        }else {
            return res.redirect("back");
        }
    })
}