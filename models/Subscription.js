const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscribed:{
        type: Boolean,
        default: false
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    },

    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription;