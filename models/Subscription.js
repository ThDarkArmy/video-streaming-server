import { Schema, model} from "mongoose";

const subscriptionSchema = new Schema({
    notification: {
        type: Boolean,
        default: false
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "Channel"
    },

    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Subscription = model('Subscription', subscriptionSchema)

export default Subscription;