const User = require('../models/User')
const Channel = require('../models/Channel')

// only for admins
const getAllChannels = async(req, res, next) => {
    try{
        const channels = await Channel.find({}).populate('owner', 'name email mobile').select("-__v")
        res.status(200).json(channels)

    }catch (err) {
        next(err)
    }
}

// find my channel
const getMyChannel = async(req, res, next) => {
    try{

    }catch (err) {
        next(err)
    }
}

const createChannel = async (req, res, next) => {
    try{
        const {owner, name, description} = req.body;

        const createdChannel = await new Channel({owner, name, description}).save()
        res.status(201).json(createdChannel)
    }catch(err){
        next(err)
    }
}

module.exports = {
    createChannel,
    getAllChannels,
    getMyChannel
}