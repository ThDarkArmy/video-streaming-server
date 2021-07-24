const User = require('../models/User')

const getLOggedInUser = async (req, res, next) => {
    try{


    }catch (err){
        next(err)
    }
}


const createUser = async (req, res, next) => {
    try{
        const {name, email, password} = req.body;

        const newUser = new User({
            name, email, password
        })

        const createdUser = await newUser.save()
        res.status(201).json(createdUser)

    }catch(err){
        next(err)
    }
}

module.exports = {
    createUser,
}