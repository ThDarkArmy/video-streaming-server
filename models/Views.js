const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    numberOfTimesViewed: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Video'
    },

    viewer: {
        type: mongoose.Schema.Types,
        ref: 'User'
    }
}, {timestamps: true})

const Views = mongoose.model("Views", viewsSchema)

module.exports = Views;