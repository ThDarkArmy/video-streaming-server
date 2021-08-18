const User = require('../models/User')

export const getLoggedInUser = async (req, res, next) => {
    try{

    }catch (err){
        next(err)
    }
}


export const createUser = async (req, res, next) => {
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

export const deleteAllUser = async (req, res, next)=>{
    try{
        await User.remove({})
        res.status(200).json({
            success: true,
            message: "All the users got deleted"
        })

    }catch (error) {
        next(error)
    }
}

