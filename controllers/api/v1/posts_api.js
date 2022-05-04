const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
// index is used when you want to list down something as an action name
module.exports.index = async function(req,res){

    let posts = await Post.find({}).populate('user')
        //for making posts display in reverse chronological order
        .sort("-createdAt")
        // to populate multiple models, use below syntax
        .populate({
            path: "comments",
            populate: {
                path: "user"
            }
        });


    res.json(200, {
        message: "List of Posts",
        posts: posts
    })
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

                // if (req.xhr){
                    
                //     return res.status(200).json({

                //         data: {
                //             post_id: req.params.id
                //         },
                //         message: "Post deleted!"
                //     });
                // }
                // req.flash("success", "Post and associated comments deleted!");


                // return res.redirect("back");
                res.json(200,{
                    message: "Post and associated comments deleted successfuly!"
                });
            
            }else {
                return res.json(401, {
                    message: "You can not delete this post!"
                });
            }

    }catch(err){
        // req.flash("error", err);

        // return res.redirect("back");
        console.log("******", err);
        return res.json(500,{
            message: "Internal Server Error!"
        })
    }

 
}