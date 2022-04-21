const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    user: {
        // there is unique objectId in robo3T for each collection
        type: mongoose.Schema.Types.ObjectId,
        // refering to "user" schema
        ref: 'User'
    }
},{
    timestamps: true
});

const Post = mongoose.model( 'Post', postSchema);
module.exports = Post;

