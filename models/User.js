const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        default: null
    },
    profileImagePath:{
        type: String,
        default: process.env.defaultProfileImagePath
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }

}, { timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User
