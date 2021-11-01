import createError from 'http-errors'
import path from 'path'
import fs from 'fs-extra'
import { getVideoDurationInSeconds } from 'get-video-duration'
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);
import extractFrames from 'ffmpeg-extract-frames'
import { randomBytes } from 'crypto'
import { BASE_URL } from "../constants";



const uploadPath = './videos/'; // Register the upload path
const thumbnailsPath = './thumbnails/';
fs.ensureDir(uploadPath); // Make sure that the upload path exists


import Video from '../models/Video'
import Channel from '../models/Channel'
import Playlist from '../models/Playlist'
import User from '../models/User'


// get all videos, only for admins and super admins
export const getAllVideos = async (req, res, next)=> {
    try {
        const videos = await Video.find({}).select("-__v")
        res.status(200).json({videos})

    } catch (error) {
        next(error)
    }
}


// get all videos by channel
export const getAllVideosByChannel = async (req, res, next) => {
    try{
        const videos = await Video.find({channel: req.params.id})
        res.status(200).json({
            success: true,
            message: "Videos on this channel",
            videos: videos
        })
    }catch(error){
        next(error)
    }
}


// get all videos by playlist
export const getAllVideosByPlaylist = async (req, res, next) => {
    try{
        const videos = await Video.find({playlist: req.params.id})
        res.status(200).json({
            success: true,
            message: "Videos on this channel",
            videos: videos
        })
    }catch(error){
        next(error)
    }
}


// get all videos by category
export const getAllVideosByCategory = (req, res, next) => {

}


// get all videos by search query
export const getAllVideosBySearchQuery = (req, res, next) =>{

}


// get a video by id, only for admins and super admins
export const getVideoById = async (req, res, next)=>{
    try {
        const video = await Video.findById(req.params.id).select("-__v")
        res.status(200).json({
            success: true,
            message: "Video",
            video:video
        })

    } catch (error) {
        next(error)
    }
}


// creating a video or uploading a video file
export const createVideo = async(req, res, next) => {
    try{
        const channel = await Channel.findOne({owner: req.user.id})
        if(!channel) throw createError.NotFound("Channel does not exist.");
        req.pipe(req.busboy); // Pipe it through busboy

        if(req.busboy){
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                let mt = mimetype.split('/')

                if(mt[0]==='video') {
                    console.log(`Upload of '${filename}' started`);
                    filename = randomBytes(20).toString('hex') +"." +filename.split('.')[filename.split().length]

                    // Create a write stream of the new file
                    const fstream = fs.createWriteStream(path.join(uploadPath, filename));

                    // Pipe it through
                    file.pipe(fstream);

                    // On finish of the upload
                    fstream.on('close', async () => {
                        console.log(`Upload of '${filename}' finished`);
                        let newVideo = new Video({
                            videoPath: path.join(uploadPath, filename),
                            mimeType: mimetype,
                            channel: channel
                        })

                        const savedVideo = await newVideo.save();

                        res.status(201).json({
                            "success": true,
                            "message": "Video uploaded successfully.",
                            video: savedVideo
                        })
                    });

                }else{
                    res.status(500).json({
                        "success": false,
                        "message": "Error while uploading video",
                        "error":{
                            "error": "File format is not a valid video format."
                        }
                    })
                }
            });

            req.busboy.on('error', (e)=>{
                res.status(500).json({
                    "success": false,
                    "message": "Error while uploading video",
                    "error":e
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
export const createVideoDescription = async (req, res, next) => {
    try{

        const {title, description, category} = req.body;

        const video = await Video.findById(req.params.id)


        if(!video) throw createError.NotFound("Video not found.");
        const channel = await Channel.findById(video.channel)

        if(!channel) throw createError.NotFound("Channel does not exist.");
        channel.videos.push(video._id)
        await channel.save()
        const videoPath = path.join(uploadPath, video._id+"_video."+video.videoPath.split(".")[1])
        const thumbnailPath = path.join(thumbnailsPath, video._id+'_thumbnail.jpg')

        await fs.renameSync(video.videoPath, videoPath)

        const {size} = await fs.statSync(videoPath)
        const duration = await getVideoDurationInSeconds(videoPath)


        // generating screenshots of video
        await extractFrames({
            input: videoPath,
            output: thumbnailPath,
            offsets: [7000]
        })

        // creating a new video object with updated data
        let newVideo = new Video({
            _id: video._id,
            title,
            description,
            category,
            channel,
            videoPath: videoPath,
            videoStreamingPath: BASE_URL+"/videostream/"+video._id,
            thumbnailPath: thumbnailPath,
            thumbnailStreamingPath: BASE_URL + "/thumbnails/" + video._id + '_thumbnail.jpg',
            size: (size/(1024*1024)).toFixed(2),
            duration: duration,
            mimeType: video.mimeType
        });

        const savedVideo = await Video.findByIdAndUpdate(req.params.id, {$set: newVideo}, {new: true})

        res.status(200).json({
            success: true,
            message: "Video description uploaded successfully",
            video: savedVideo
        })

    }catch(error){
        next(error)
    }
}


// Update a video by id
export const updateVideoDescription = async(req, res, next)=>{
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
        res.status(200).json({
            success: true,
            message: "Video updated successfully.",
            video: updatedVideo
        })

    }catch(error){
        next(error)
    }
}


// updating the thumbnail of the video
export const updateThumbnail = async (req, res, next)=>{
    try{
        const video = await Video.findById(req.params.id)
        if(!video) throw createError.NotFound("Video does not exist")

        req.pipe(req.busboy)

        if(req.busboy){
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype)=>{
                if(mimetype.split("/")[0]==="image"){

                    filename = video._id+"_thumbnail.jpg"
                    const fstream = fs.createWriteStream(path.join(thumbnailsPath, filename))
                    console.log("Uploading started")
                    file.pipe(fstream)

                    fstream.on("close", async ()=>{
                        res.status(201).json({
                            success: true,
                            message: "Thumbnail updated successfully",
                            video: video
                        })
                    })

                } else{
                    return res.status(500).json({
                        "success": false,
                        "message": "Error while uploading thumbnail",
                        "error":{
                            "error": "File format is not a valid image format."
                        }
                    })
                }
            })
            req.busboy.on('error', (e)=>{
                return res.status(500).json({
                    "success": false,
                    "message": "Error while uploading video",
                    "error":e
                })
            })
        }else{
            throw createError.BadRequest("Please attach a video file.");
        }

    }catch(err){
        next(err)
    }
}


// delete a video by id
export const deleteVideo = async(req, res, next)=>{
    try{
        let video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video with given id not found.")
        await fs.unlinkSync(video.videoPath);
        await fs.unlinkSync(video.thumbnailPath);

        let response = await Video.findByIdAndRemove(req.params.id.toString().trim())
        res.status(200).json({
            success: true,
            "message": "Video deleted successfully",
            response
        })
    }catch(error){
        next(error)
    }
}



// delete all videos, only for super admin
export const deleteAllVideos = async (req, res, next)=>{
    try{

        console.log(req.user.roles)
        let response = await Video.deleteMany({})

        // deleting all videos
        fs.readdir(uploadPath, (err, files)=>{
            if(err) throw err
            for(const file of files){
                fs.unlink(path.join(uploadPath, file), err=>{
                    if(err) throw err
                })
            }
        })

        // deleting all thumbnails
        fs.readdir(thumbnailsPath, (err, files)=>{
            if(err) throw err
            for(const file of files){
                fs.unlink(path.join(thumbnailsPath, file), err=>{
                    if(err) throw err
                })
            }
        })
        res.status(200).json({
            success: true,
            message: "All videos deleted successfully",
            response
        })
    }catch(error){
        next(error)
    }
}

