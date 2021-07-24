const createError = require('http-errors')
const path = require('path')
const fs = require('fs-extra')
const { videoDescriptionSchema } = require('../helpers/validationSchema')
const { getVideoDurationInSeconds } = require('get-video-duration')
const { videoSchema } = require('../helpers/validationSchema')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const extractFrames = require('ffmpeg-extract-frames')


const uploadPath = './videos/'; // Register the upload path
const thumbnailsPath = './thumbnails/';
fs.ensureDir(uploadPath); // Make sure that the upload path exists


const Video = require('../models/Video')
const Channel = require('../models/Channel')
const Playlist = require('../models/Playlist')
const User = require('../models/User')


const getAllVideos = async (req, res, next)=> {
    try {
        const videos = await Video.find({}).select("-__v")
        res.status(200).json({videos})

    } catch (error) {
        next(error)
    }
}

const getAllVideosByChannel = (req, res, next) => {

}

 const getAllVideosByPlaylist = (req, res, next) => {

}

const getAllVideosByCategory = (req, res, next) => {

}

const getAllVideosBySearchQuery = (req, res, next) =>{

}


const getVideoById = async (req, res, next)=>{
    try {
        const video = await Video.findById(req.params.id).select("-__v")
        res.status(200).json(video)

    } catch (error) {
        next(error)
    }
}

// creating a video or uploading a video file
const createVideo = async(req, res, next) => {
    try{
        req.pipe(req.busboy); // Pipe it through busboy

        if(req.busboy){
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                let mt = mimetype.split('/')

                if(mt[0]==='video') {
                    console.log(`Upload of '${filename}' started`);

                    // Create a write stream of the new file
                    const fstream = fs.createWriteStream(path.join(uploadPath, filename));

                    // Pipe it through
                    file.pipe(fstream);

                    // On finish of the upload
                    fstream.on('close', async () => {
                        console.log(`Upload of '${filename}' finished`);
                        let newVideo = new Video({
                            videoPath: path.join(uploadPath, filename),
                            mimeType: mimetype
                        })

                        const savedVideo = await newVideo.save();

                        res.status(201).json({"msg": "Video uploaded successfully.", "id": savedVideo.id})
                    });

                }else{
                    res.status(500).json({
                        "error": {
                            "status": 500,
                            "msg": "File format is not video."
                        }
                    })
                }
            });

            req.busboy.on('error', (e)=>{
                res.status(500).json({
                    "error": {
                        "status": 500,
                        "msg": "Error occurred while uploading file."
                    }
                })
            })
        }else{
            throw createError.BadRequest("Please attach a video file.");
        }

    }catch (err){
        next(err)
    }

}

// updating the video with its description
const createVideoDescription = async (req, res, next) => {
    try{

        const validate = await videoDescriptionSchema.validateAsync(req.body)
        const {title, description, category, ownerChannel} = req.body;

        const video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video not found.");

        const {size} = fs.statSync(video.videoPath)
        const duration = await getVideoDurationInSeconds(video.videoPath)
        const filename = video.videoPath.split('\\')[1]

        // generating screenshots of video
        await extractFrames({
            input: video.videoPath,
            output: thumbnailsPath + filename.split('.')[0] + '.jpg',
            offsets: [7000]
        })

        // creating a new video object with updated data
        let newVideo = new Video({
            _id: video._id,
            title,
            description,
            category,
            ownerChannel,
            videoPath: video.videoPath,
            streamingPath: process.env.BASE_URL+"/videostream/"+video._id,
            thumbnailPath: process.env.BASE_URL + "/thumbnails/" + filename.split('.')[0] + '.jpg',
            size: (size/(1024*1024)).toFixed(2),
            duration: duration,
            mimeType: video.mimeType

        });

        const savedVideo = await Video.findByIdAndUpdate(req.params.id, {$set: newVideo}, {new: true})

        res.status(200).json(savedVideo)

    }catch(error){
        next(error)
    }
}


const updateVideoDescription = async(req, res, next)=>{
    try{
        const {title, description, category} = req.body;

        let video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video with given id not found.")

        let newVideo = new Video({
            _id: req.params.id,
            title,
            description,
            category,
            path: video.path,
            duration: video.duration,
            size: video.size,
            type: video.type
        });
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {$set: newVideo}, {new: true})
        res.status(200).json({"msg": "Video updated successfully."})

    }catch(error){
        next(error)
    }
}

const updateThumbnail = (req, res, next)=>{
    try{

    }catch(err){
        next(err)
    }
}


const deleteVideo = async(req, res, next)=>{
    try{
        let video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video with given id not found.")
        await fs.unlinkSync(video.path);

        var response = await Video.findByIdAndRemove(req.params.id.toString().trim())
        res.status(200).json({"msg": "Video deleted successfully"})
    }catch(error){
        next(error)
    }
}

module.exports = {
    getAllVideos,
    getAllVideosByCategory,
    getAllVideosByChannel,
    getAllVideosByPlaylist,
    getAllVideosBySearchQuery,
    getVideoById,
    createVideo,
    createVideoDescription,
    updateVideoDescription,
    updateThumbnail,
    deleteVideo
}