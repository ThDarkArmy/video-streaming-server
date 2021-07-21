const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const authSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
})

const loginSchema = Joi.object({
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required()
})

const videoDescriptionSchema = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().min(3).required(),
    ownerChannel: Joi.objectId().required(),
    
})

const videoSchema = Joi.object({

})



module.exports = {
    authSchema,
    loginSchema,
    videoDescriptionSchema
}

