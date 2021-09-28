import Subscription from '../models/Subscription'
import Channel from "../models/Channel"
import createError from 'http-errors'

// subscribe or unsubscribe a channel
export const subscribeOrUnsubscribe = async (req, res, next) => {
    try{
        const user = req.user
        const { channelId }= req.body
        let channel = await Channel.findById(channelId)
        if(!channel) throw createError.NotFound("Channel not found.")
        let subscription = await Subscription.findOne({channel: channel._id, subscriber: user.id})
        let subscribed = false
        if(!subscription){
            subscription = new Subscription({
                channel: channel._id,
                subscriber: user.id,
            })
            await subscription.save()
            channel.subscription.push(subscription._id)
            channel.numberOfSubscribers+=1
            subscribed = true
        }else{
            channel.numberOfSubscribers-=1
            channel.subscription = channel.subscription.filter(subscriptionId => user.id===subscriptionId)
            await Subscription.deleteOne({channel: channelId, subscriber: user.id})
        }

        await channel.save()

        res.status(201).json({
            success: true,
            message: subscribed? "Channel subscribed successfully": "Channel unsubscribed successfully"
        })
    }catch (error){
        next(error)
    }
}

// on or off notification for a channel
export const onOrOffNotification = async (req, res, next) => {
    try{
        const user = req.user
        const { channelId }= req.body
        let channel = await Channel.findById(channelId)
        if(!channel) throw createError.NotFound("Channel not found.")
        let subscription = await Subscription.findOne({channel: channel.id, subscriber: user.id})
        if(!subscription) throw createError.NotFound("First you need to subscribe the channel.")
        subscription.notification = !subscription.notification

        await subscription.save()

        res.status(200).json({
            success: true,
            message: subscription.notification? "Notification for this channel turned on": "Notification for this channel turned off"
        })
    }catch(error){
        next(error)
    }
}