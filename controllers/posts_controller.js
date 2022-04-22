const Post = require("../models/post");

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