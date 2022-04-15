const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    name: {
        type: String,
        required: true
    }
},{// whenever database is created or updated
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;