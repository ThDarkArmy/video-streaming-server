import createError from 'http-errors'
import Channel from '../models/Channel'
import Video from "../models/Video";
import User from '../models/User';
import Playlist from '../models/Playlist';

// only for admins
export const getAllChannels = async(req, res, next) => {
    try{
        const channels = await Channel.find({}).populate('user', 'name email mobile').select("-__v")
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
            body: channel
        })

    }catch (err) {
        next(err)
    }
}

// get a channel by id
export const getChannelById = async(req, res, next) => {
    try{
        const channel = await Channel.findById(req.params.id);

        if(!channel) throw createError.NotFound("Channel not found.");

        channel.views= parseInt(channel.views) + 1;
        const updatedChannel = await channel.save();
        res.status(200).json({
            success: true,
            message: "Requested channel found",
            body: updatedChannel
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
        console.log("Request body: ", req.body);
        const {name, description, location, links, email} = req.body;
        const user = req.user.id
        const channel = await Channel.findOne({user: user})
        if(channel) throw createError.BadRequest("Channel already exist for the user.")
        const createdChannel = await new Channel({user, name, description, location, links, email}).save()
        await User.findByIdAndUpdate(req.user.id, {$set: {"channel": createdChannel._id}}, {new: true});

        await new Playlist({name: "Default Playlist", channel: createdChannel._id}).save();

        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            body: createdChannel
        })
    }catch(err){
        next(err)
    }
}

// update the name of the channel
export const updateChannel = async (req, res, next) => {
    try{
        const { name, description, location, email} = req.body;
        let channel = await Channel.findOne({user: req.user.id})
        
        if(!channel) throw createError.NotFound("Channel with given id does not exist.")
        channel.name = name;
        channel.description = description;
        channel.location = location;
        channel.email = email;
        const updatedChannel = await channel.save()
        res.status(200).json({
            success: true,
            message: "Channel updated successfully.",
            body: updatedChannel
        })
    }catch(err){
        next(err)
    }
}


// delete my channel
export const deleteChannel = async (req, res, next)=>{
    try{
        const channel = await Channel.findOne({user: req.user.id});
        if(!channel) throw createError.NotFound("Channel with given id does not exist.");
        const deletedVideos = await Video.deleteMany({channel: channel._id});
        const deletedChannel = await Channel.findByIdAndDelete(channel._id);

        await User.findByIdAndUpdate(req.user.id, {$set: {channel: null}}, {new: true});

        res.status(201).json({
            success: true,
            message: "Channel deleted successfully.",
            body: {deletedChannel, deletedVideos}
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
            body: deletedChannels
        })
    }catch(err){
        next(err)
    }
}

