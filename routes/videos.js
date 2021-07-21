const express = require('express')
const Video = require('../models/Video')


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
    deleteVideo } = require('../controllers/VideoContoller')


const router = express.Router()

// get all videos
router.get('/all', getAllVideos)

// get a specific video by id
router.get('/byId/:id', getVideoById)

// upload video to server
router.post('/video', createVideo)

// upload video-description to server
router.post('/description/:id', createVideoDescription)


// update a video on server
router.put('/:id', updateVideoDescription)

// update thumbnail of a video to server
router.patch('/update-thumbnail/:id', updateThumbnail)

// delete an specific video by id from server
router.delete('/:id', deleteVideo)


module.exports = router



