const express = require('express')
const Video = require('../models/Video')
const createError = require('http-errors')
const path = require('path')
const fs = require('fs-extra')
const { getVideoDurationInSeconds } = require('get-video-duration')
const {videoSchema} = require('../helpers/validationSchema')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const extractFrames = require('ffmpeg-extract-frames')
 


const uploadPath = './videos/'; // Register the upload path
const thumbnailsPath = './thumbnails/';
fs.ensureDir(uploadPath); // Make sure that the upload path exists

const router = express.Router()

// get all vids
router.get('/all', async (req, res, next)=>{
    try {
        const videos =  await Video.find({}).select("-__v")
        res.status(200).json({videos})
        
    } catch (error) {
        next(error)
    }
})

// get a specific video by id
router.get('/byId/:id', async (req, res, next)=>{
    try {
        const video = await Video.findById(req.params.id).select("-__v")
        res.status(200).json(video)
        
    } catch (error) {
        next(error)
    }
})

// upload video-description to server
router.post('/description', async(req, res, next)=>{
    try{

        const validate = await videoSchema.validateAsync(req.body)
        const {title, description, category} = req.body;

        var newVideo = new Video({
            title,
            description,
            category
        });

        const savedVideo = await newVideo.save()

        res.status(200).json({"id": savedVideo.id})

    }catch(error){
        next(error)
    }
})

// upload video to server
router.post('/video/:id', async (req, res, next)=>{
    try{

        const video = await Video.findById(req.params.id)
        if(!video) throw createError.NotFound("Video with given id not found.")

        req.pipe(req.busboy); // Pipe it through busboy

        if(req.busboy){
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                var mt = mimetype.split('/')
    
                if(mt[0]==='video') {
                    console.log(`Upload of '${filename}' started`);
        
                    // Create a write stream of the new file
                    const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        
                    // Pipe it through
                    file.pipe(fstream);
            
                    // On finish of the upload
                    fstream.on('close', async () => {
                        console.log(`Upload of '${filename}' finished`);
                        const {size} = fs.statSync(path.join(uploadPath, filename))
                        var duration = await getVideoDurationInSeconds(path.join(uploadPath, filename))

                        // generating screenshots of video
                        await extractFrames({
                            input: path.join(uploadPath, filename),
                            output: thumbnailsPath + filename + '.jpg',
                            offsets: [7000]
                          })
                        
                        // creating a new video collection
                        var newVideo = new Video({
                            _id: video._id,
                            title: video.title,
                            description: video.description,
                            category: video.category,
                            path: path.join(uploadPath, filename),
                            streamingPath: process.env.BASE_URL+"/videostream/"+video._id,
                            thumbnailPath: process.env.BASE_URL + thumbnailsPath + filename + '.jpg',
                            size: (size/(1024*1024)).toFixed(2),
                            duration: duration,
                            mimeType: mimetype
                        })

                        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {$set: newVideo}, {new: true})
                        res.status(201).json({"msg": "File uploaded successfully."})
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
                        "msg": "Error occured while uploading file."
                    }
                })
            })
        }else{
            throw createError.BadRequest("Please attach a video file.");
        }

    }catch(error){
        next(error)
    }
})

// update a video on server
router.put('/:id', async(req, res, next)=>{
    try{
        const {title, description, category} = req.body;

        var video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video with given id not found.")

        var newVideo = new Video({
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
        res.status(200).json({"msg": "Video upadted successfully."})

    }catch(error){
        next(error)
    }
})

// update thumbnail of a video to server
router.patch('/update-thumbnail/:id', (req, res, next)=>{
    try{

    }catch(err){
        next(err)
    }
})



// delete an specific video by id from server
router.delete('/:id', async(req, res, next)=>{
    try{
        var video = await Video.findById(req.params.id)

        if(!video) throw createError.NotFound("Video with given id not found.")
        await fs.unlinkSync(video.path);

        var response = await Video.findByIdAndRemove(req.params.id.toString().trim())
        res.status(200).json({"msg": "Video deleted successfully"})
    }catch(error){
        next(error)
    }
})


module.exports = router