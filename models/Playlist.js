import {Schema, model} from 'mongoose';

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    channel: {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    },

    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }]
}, {timestamps: true})

playlistSchema.index({name: 'text'})

const Playlist = model('Playlist', playlistSchema)

export default Playlist;