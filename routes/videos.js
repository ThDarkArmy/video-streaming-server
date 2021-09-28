import { Router } from 'express'
import {videoValidation} from "../validators/VideoValidator";
import {AuthenticateUser} from "../middlewares/AuthMiddleware";
import ValidationMiddleware from "../middlewares/ValidatorMiddleware";
import {assertRole} from "../middlewares/AuthMiddleware";


const { getAllVideos,
    getAllVideosByCategory,
    getAllVideosByChannel,
    getAllVideosByPlaylist,
    getAllVideosBySearchQuery,
    getVideoById,
    createVideoDescription,
    createVideo,
    updateVideoDescription,
    updateThumbnail,
    deleteVideo,
    deleteAllVideos
    } = require('../controllers/VideoContoller')


const router = Router()

// get all videos
router.get(['/','/all'], AuthenticateUser, assertRole(['ADMIN','SUPERADMIN']), getAllVideos)

// get a specific video by id
router.get('/byId/:id',assertRole(['ADMIN', 'SUPERADMIN']), AuthenticateUser, getVideoById)

// get videos by channel
router.get("/byChannel/:id", getAllVideosByChannel)

// get videos by playlist
router.get("/byPlaylist/:id", getAllVideosByPlaylist)

// upload video to server
router.post('/video', AuthenticateUser, createVideo)

// upload video-description to server
router.post('/description/:id', AuthenticateUser, videoValidation, ValidationMiddleware, createVideoDescription)

// update a video on server
router.put('/:id',AuthenticateUser, videoValidation, ValidationMiddleware, updateVideoDescription)

// update thumbnail of a video to server
router.patch('/update-thumbnail/:id', AuthenticateUser, updateThumbnail)

// delete an specific video by id from server
router.delete('/:id',AuthenticateUser, deleteVideo)


// delete all videos
router.delete("/", AuthenticateUser, assertRole(["SUPERADMIN"]), deleteAllVideos)


export default router




