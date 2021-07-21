const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    ownerChannel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },

    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist;