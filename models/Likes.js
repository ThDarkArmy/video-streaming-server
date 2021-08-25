const mongoose = require('mongoose')

const likesSchema = new mongoose.Schema({
    like: {
        type: Boolean,
        default: false
    },
    dislike: {
        type: Boolean,
        default: false
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


const Likes = mongoose.model('Likes',likesSchema)

module.exports = Likes