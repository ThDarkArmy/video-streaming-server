const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    replyText: {
        type: String,
        required: true,
        trim: true
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply;