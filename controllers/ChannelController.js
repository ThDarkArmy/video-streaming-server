import createError from 'http-errors'
import Channel from '../models/Channel'
import Video from "../models/Video";

// only for admins
export const getAllChannels = async(req, res, next) => {
    try{
        const channels = await Channel.find({}).populate('owner', 'name email mobile').select("-__v")
        res.status(200).json(channels)

    }catch (err) {
        next(err)
    }
}

// find my channel
export const getMyChannel = async(req, res, next) => {
    try{

        const channel = await Channel.findOne({owner: req.user._id})

        if(!channel) throw createError.NotFound("No channel exist of the logged in user.")

        res.status(200).json({
            success: true,
            message: "Channel for logged in user",
            channel: channel
        })

    }catch (err) {
        next(err)
    }
}

// get a channel by id
export const getChannelById = async(req, res, next) => {
    try{
        const channel = await Channel.findById(req.params.id)

        if(!channel) throw createError.NotFound("Channel does not exists with the given id.")

        res.status(200).json({
            success: true,
            message: "Requested channel found",
            channel: channel
        })

    }catch (err) {
        next(err)
    }
}

// get a channel similar to search query
export const getChannelsByName = async(req, res, next) => {
    try{
        const channels = await Channel.find({name: req.params.name})

        res.status(200).json({
            success: true,
            message: "Requested channel found",
            channels: channels
        })

    }catch (err) {
        next(err)
    }
}

// create a channel
export const createChannel = async (req, res, next) => {
    try{
        const {name, description} = req.body;
        const owner = req.user.id
        const channel = await Channel.findOne({owner: owner})
        if(channel) throw createError.BadRequest("Channel already exist for the user.")
        const createdChannel = await new Channel({owner, name, description}).save()
        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel: createdChannel
        })
    }catch(err){
        next(err)
    }
}

// update the name of the channel
export const updateChannel = async (req, res, next) => {
    try{
        const { name, description} = req.body;
        let channel = await Channel.findOne({owner: req.user._id})

        if(!channel) throw createError.NotFound("Channel with given id does not exist.")
        channel.name = name;
        channel.description = description;
        const updatedChannel = await channel.save()
        console.log(channel)
        console.log(updatedChannel)
        res.status(201).json({
            success: true,
            message: "Channel updated successfully.",
            channel: updatedChannel
        })
    }catch(err){
        next(err)
    }
}


// delete my channel
export const deleteChannel = async (req, res, next)=>{
    try{
        const channel = await Channel.findOne({owner: req.user._id})
        console.log(channel)
        if(!channel) throw createError.NotFound("Channel with given id does not exist.")
        const deletedVideos = await Video.deleteMany({channel: channel._id})
        const deletedChannel = await Channel.findByIdAndDelete(channel._id)

        res.status(201).json({
            success: true,
            message: "Channel deleted successfully.",
            response: {deletedChannel, deletedVideos}
        })
    }catch(err){
        next(err)
    }
}

// delete all channels , only for admins
export const deleteAllChannels = async (req, res, next)=>{
    try{

        const deletedChannels = await Channel.deleteMany({})

        res.status(201).json({
            success: true,
            message: "All channels deleted successfully.",
            response: deletedChannels
        })
    }catch(err){
        next(err)
    }
}

