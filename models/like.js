const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
//  this defines the object id of the liked object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
// this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        // value of onModel in refPath of likeable can only be post and comment, nothing else
        // if we remove this enum field, it can be anything also
        enum: ['Post', 'Comment']
    }
}, {
    timestamps: true
})


const Like = mongoose.model('Like', likeSchema);

module.exports = Like;