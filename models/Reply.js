const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },

    onComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply;