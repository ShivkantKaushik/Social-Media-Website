const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function(req, res){

    try{
        await Post.create({
            content: req.body.content,
            // we are able to access req.user because in setAuthenticated function in passport-local-strategy
            // we have written req.locals.user = req.user , which means send req.user to views, to all file in views
            user: req.user._id
       });
       req.flash("success", "Post published!");
       return res.redirect('back');

    }catch(err){
        // console.log("Error",err);
        req.flash("error", err);

        return res.redirect("back");
    };
    
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        //here post.user means user id only according to schema, until we chhose to populate user
            // post.user would return id in string format
            // req.user.id instead of req.user._id, .id is moongose syntax to convert it into string
            if(post.user == req.user.id){
                post.remove();
    
                await Comment.deleteMany({post: req.params.id});
                req.flash("success", "Post and associated comments deleted!");


                return res.redirect("back");
            }else {
                req.flash("error", "You can not delete this post!");
                return res.redirect("back");
            }

    }catch(err){
        req.flash("error", err);

        return res.redirect("back");
    }

 
}