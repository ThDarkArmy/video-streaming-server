import{model, Schema, } from 'mongoose'

const commentSchema = new Schema({
    commentText: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Reply"
    }]
}, {timestamps: true})

const Comment = model("Comment", commentSchema)

export default Comment