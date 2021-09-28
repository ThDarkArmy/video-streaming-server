import { Schema, model} from "mongoose";

const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
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
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    playlists: [{
        type: Schema.Types.ObjectId,
        ref:'Playlist'
    }],

    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],

    subscription: [{
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    }]

}, {timestamps: true})


export default model("Channel", channelSchema)
