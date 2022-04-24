const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function(req, res){
    Post.create({
         content: req.body.content,
         // we are able to access req.user because in setAuthenticated function in passport-local-strategy
         // we have written req.locals.user = req.user , which means send req.user to views, to all file in views
         user: req.user._id
    }, function(err, post){
        if(err){ console.log('error in creating the post'); return;}

        return res.redirect('back');
    })
}


module.exports.destroy = function(req, res){

    Post.findById(req.params.id, function(err, post){
        //here post.user means user id only according to schema, until we chhose to populate user
        // post.user would return id in string format
        // req.user.id instead of req.user._id, .id is moongose syntax to convert it into string
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect("back");
            });
        }else {
            return res.redirect("back");
        }
    })
}