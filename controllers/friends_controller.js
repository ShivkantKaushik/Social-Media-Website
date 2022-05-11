
const Friendship = require("../models/friendship");
const User = require("../models/user");
module.exports.create =  function(req,res){
    let user = User.findById(req.body.toUser, async function(err, toUser){
        if(err){console.log("Error in finding user", err);}
        if(toUser){
             let friendship = await  Friendship.create({
                from_user: req.user._id,
                to_user: toUser._id
                });
                 req.user.friendships.push(friendship);
                req.user.save();
                 toUser.friendships.push(friendship);
                toUser.save();
        }
    });
 
   


    return res.status(200).json({

        data: {
            isFriend: true
        },
        message: "Friendship Created!"
    });

}


module.exports.destroy = function(req, res){
    let user = User.findById(req.body.toUser,  function(err, toUser){
        if(err){console.log("Error in finding user", err);}
        if(toUser){
            Friendship.findOne({ $or: [{ from_user: req.user.id, to_user: toUser.id }, {from_user: toUser.id, to_user: req.user.id}]}, async function(err, friendship){
                if(err){console.log("Error in deleting friendship", err); }

            // records were only deleting from friendship collection, not from user friendships array
            // so tried adding await here, and it worked
            await User.findByIdAndUpdate(req.user.id, { $pull: {friendships: friendship.id}});
            await User.findByIdAndUpdate(toUser.id, { $pull: {friendships: friendship.id}});
            await Friendship.deleteOne(friendship);
                
            });
            
            return res.status(200).json({
        
                data: {
                    isFriend: false
                },
                message: "Friendship Destroyed!"
            });
        }

    });
    

}

