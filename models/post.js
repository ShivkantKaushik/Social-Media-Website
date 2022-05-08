const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    user: {
        // there is unique objectId in robo3T for each object
        type: mongoose.Schema.Types.ObjectId,
        // refering to "user" schema
        ref: 'User'
    },

    //include the array of ids of all the comments in the post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model( 'Post', postSchema);
module.exports = Post;

