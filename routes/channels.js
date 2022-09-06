import {Router} from 'express'
const router = Router()

import {AuthenticateUser, assertRole} from "../middlewares/AuthMiddleware";
import { channelValidation } from "../validators/ChannelValidator";
import ValidationMiddleware from "../middlewares/ValidatorMiddleware";
import {
    createChannel,
    getChannelById,
    getAllChannels,
    getMyChannel,
    updateChannel,
    deleteChannel,
    getChannelsByName, deleteAllChannels
} from '../controllers/ChannelController'

router.get(['/','/all'], getAllChannels)
router.get('/myChannel',AuthenticateUser, getMyChannel)
router.get('/byName/:name', getChannelsByName)
router.get("/byId/:id", AuthenticateUser, assertRole(['ADMIN', 'SUPERADMIN', 'USER']), getChannelById)
router.post('/',AuthenticateUser, assertRole(['USER']), channelValidation, ValidationMiddleware, createChannel)
router.put("/",AuthenticateUser, assertRole(['USER']), channelValidation, ValidationMiddleware, updateChannel)
router.delete("/", AuthenticateUser, assertRole(['USER']),  deleteChannel)
router.delete("/all", AuthenticateUser, assertRole(['SUPERADMIN']), deleteAllChannels)

export default router