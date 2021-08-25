import createError from 'http-errors'
import Channel from '../models/Channel'

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
        const channel = await Channel.find({owner: req.user.id})

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


// create a channel
export const createChannel = async (req, res, next) => {
    try{
        const {owner, name, description} = req.body;

        const createdChannel = await new Channel({owner, name, description}).save()
        res.status(201).json(createdChannel)
    }catch(err){
        next(err)
    }
}

// update the name of the channel
export const updateChannel = async (req, res, next) => {
    try{
        const { name, description} = req.body;
        let channel = await Channel.find({owner: req.user.id})

        if(!channel) throw createError.NotFound("Channel with given id does not exist.")
        channel.name = name;
        channel.descritpion = description;
        const updatedChannel = await channel.save()

        res.status(201).json({
            success: true,
            message: "Channel updated successfully.",
            channel: updatedChannel
        })
    }catch(err){
        next(err)
    }
}

// delete channel by id
export const deleteChannel = async (req, res, next)=>{
    try{
        const channel = await Channel.find({owner: req.user.id})

        if(!channel) throw createError.NotFound("Channel with given id does not exist.")
        const deletedChannel = await channel.findByIdAndDelete(req.params.id)

        res.status(201).json({
            success: true,
            message: "Channel deleted successfully."
        })
    }catch(err){
        next(err)
    }
}

