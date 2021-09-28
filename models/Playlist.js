const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },

    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
}, {timestamps: true})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist;