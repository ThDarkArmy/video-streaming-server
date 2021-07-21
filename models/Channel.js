const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    about: {
        type: String,
        default: ""
    },
    backgroundImagePath: {
        type: String,
        default: process.env.defaultImagePath
    },
    numberOfSubscribers: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Playlist'
    }],

    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]

}, {timestamps: true})

const Channel = mongoose.model("Channel", channelSchema)

module.exports = Channel;