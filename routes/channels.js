import {Router} from 'express'
const router = Router()

import {AuthenticateUser} from "../middlewares/PassportMiddleware";
import { channelValidation } from "../validators/ChannelValidator";
import ValidationMiddleware from "../middlewares/ValidatorMiddleware";

import { createChannel,getChannelById, getAllChannels, getMyChannel, updateChannel, deleteChannel } from '../controllers/ChannelController'

router.get('/all', getAllChannels)
router.get('/myChannel',AuthenticateUser, getMyChannel)
router.get("/byId/:id", getChannelById)
router.post('/',AuthenticateUser, channelValidation, ValidationMiddleware, createChannel)
router.put("/",AuthenticateUser, channelValidation, ValidationMiddleware, updateChannel)
router.delete("/", AuthenticateUser, deleteChannel)

export default router