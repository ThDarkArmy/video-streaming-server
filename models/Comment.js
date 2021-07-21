const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: mongoose.schema.Types.ObjectId,
        ref: 'Video'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment