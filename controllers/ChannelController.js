const User = require('../models/User')
const Channel = require('../models/Channel')

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
}