const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    category: {
        type: String,
    },
    videoPath: {
        type: String,
    },
    thumbnailPath: {
        type: String,
    },
    streamingPath: {
        type: String,
    },

    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    mimeType: {
        type: String,
    },
    size: {
        type: Number
    },

    duration: {
        type: Number
    },

    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    ownerChannel : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }

}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema)

module.exports = Video



