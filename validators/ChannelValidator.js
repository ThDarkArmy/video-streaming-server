import { check } from 'express-validator';

const name = check("name", "Channel name is required.").not().isEmpty()
const description = check("description", "Description must be of length more than or equal to 6.").isLength({min:6})

export const channelValidation = [name, description]
