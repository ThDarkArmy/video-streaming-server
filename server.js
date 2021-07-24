import express from 'express';
import morgan from 'morgan'
import createError from 'http-errors'
import busboy from 'connect-busboy'
import cors from 'cors'

const app = express()

// dotenv
require('dotenv').config()

// database connection
require('./config/database')

const PORT = process.env.PORT || 5678

// middleware
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use(morgan('dev'))
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // busboy middle-ware


app.get('/', (req, res, next)=>{
    try{
        res.redirect("/videos/all");
    }catch(error){
        next(error)
    }
})
 
// routes
const videos = require('./routes/videos')
const videostream = require('./routes/videostream')
const users = require('./routes/users')
const channels = require('./routes/channels')

app.use('/videos', videos)
app.use('/videostream', videostream)
app.use('/users', users)
app.use('/channels', channels)



app.use(async(req, res, next)=>{
    next(createError.NotFound())
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            msg: err.message
        }
    })
})


app.listen(PORT, ()=> console.log("Server is listening on port: "+ PORT))

