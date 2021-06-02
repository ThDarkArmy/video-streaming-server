const e = require('express')
const express = require('express')
const fs = require('fs')
const router = express.Router()
const createError = require('http-errors')
const Video = require('../models/Video')

router.get('/:id', async (req, res, next)=>{
    try{
        const video = await Video.findById(req.params.id);
        if(!video) throw createError.NotFound("Video with given id not found.")
        if(fs.existsSync(video.path)){
            const range = req.headers.range 
                       
            console.log(req.headers)
            const videoSize = fs.statSync(video.path).size

            const CHUNK_SIZE = 10**6
            const start = Number(range.replace(/\D/g, ""))
            
            
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

            // create headers
            const contentLength = end - start + 1
            // start = 1024

            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": video.mimeType,
                "If-Range": "\"<ETag#>\""
            }
           
            // HTTP Status 206 for Partial Content
            res.writeHead(206, headers);

            // create video read stream for this particular chunk
            const videoStream = fs.createReadStream(video.path, { start, end });

            // Stream the video chunk to the client
            videoStream.pipe(res);
            
            // res.send(video)

        }else{
            throw createError.NotFound("Video file not found.")
        }

    }catch(error){
        next(error)
    }
})

module.exports = router
