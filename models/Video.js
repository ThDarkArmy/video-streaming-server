const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    path: {
        type: String,
    },

    category: {
        type: String,
    },

    views: {
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

   

}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema)

module.exports = Video