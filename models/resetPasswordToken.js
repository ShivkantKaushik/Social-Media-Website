const mongoose = require("mongoose");

const resetPasswordTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    token: String,
    valid: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const ResetPasswordToken = mongoose.model("ResetPasswordToken", resetPasswordTokenSchema);
module.exports = ResetPasswordToken;