const mongoose = require("mongoose");

const friendshipSchema = mongoose.Schema({
    //the user who sent request
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
