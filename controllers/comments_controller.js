const Comment = require("../models/comment");
const Post = require("../models/post")

module.exports.create = async function(req,res){
    try{
        //name of the input is post , in comments form
    let post  = await Post.findById(req.body.post);

    //if post exists
    if(post){
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        })
        //update the comment in the post
        post.comments.push(comment);
        post.save();

        if (req.xhr){
            // Similar for comments to fetch the user's id!
            comment = await comment.populate({path: 'user', populate : {path: 'name'}});

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment created!"
            });
        }

        req.flash("success", "Comment added!");
        res.redirect("/");
    }
    }catch(err){
        // console.log("Error", err);
        req.flash("error", err);
        return res.redirect("back");
    }
}

module.exports.destroy = async function(req, res){
    try{
        //populating post so that we can get comment.post.user, and compare it with who logged in 
    // so that user who owns the post can also delete the comment
    let comment = await Comment.findById(req.params.id).populate("post");

    //if user who commented equals to who logged in OR who owns the post equals to who logged in 
    if (comment.user == req.user.id || comment.post.user == req.user.id){
        //comment.post give post id in string
        let postId = comment.post;

        comment.remove();
        // mongoose syntax to pull out the comment id from list of comments
        // pull(delete) comment with req.params.id from comments of post related to postId
        let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
        
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

        req.flash("success", "Comment deleted!");
        return res.redirect("back");

    }else {
        return res.redirect("back");
    }
    }catch(err){
        // console.log("Error", err);
        req.flash("error",err);
        return res.redirect("back") ;
    }
}