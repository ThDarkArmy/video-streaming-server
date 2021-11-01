import {Schema, model} from "mongoose";

const videoSchema = new Schema({
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
    videoStreamingPath: {
        type: String,
    },
    thumbnailPath: {
        type: String,
    },
    thumbnailStreamingPath: {
        type: String
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

    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],

    channel : {
        type: Schema.Types.ObjectId,
        ref: "Channel"
    }

}, {timestamps: true})

const Video = model('Video', videoSchema)

export default Video



