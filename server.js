const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const busboy = require('connect-busboy')
const cors = require('cors')


const app = express()

// dotenv
require('dotenv').config()

// database connection
require('./config/database')


const PORT = process.env.PORT || 5000

// middlewares
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

app.use('/videos', videos)
app.use('/videostream', videostream)


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

