import Playlist from "../models/Playlist"
import Channel from "../models/Channel"
import createError from 'http-errors'
import Video from '../models/Video'


// get all playlist by channel
export const getAllPlaylistByChannel = async (req, res, next)=>{
    try{
        const playlists = await Playlist.find({channel: req.params.id}).populate("videos", "-__v")
        res.status(200).json({
            success: true,
            message: "Playlists for this channel",
            playlists: playlists
        })
    }catch(error){
        next(error)
    }
}

// get a playlist by id
export const getPlaylistById = async (req, res, next)=>{
    try{
        const playlist = await Playlist.findById(req.params.id).populate("videos", "-__v")
        res.status(200).json({
            success: true,
            message: "Playlist for provided id",
            playlist: playlist
        })

    }catch(error){
        next(error)
    }
}

// create a playlist
export const createPlaylist =  async (req, res, next) => {
    try{
        const { name } = req.body
        let channel = await Channel.findOne({owner: req.user._id})
        if(!channel) throw createError.NotFound("Channel does not exists")
        const playlist = new Playlist({
            name: name,
            channel: channel
        })

        const createdPlaylist = await playlist.save()

        channel.playlists.push(createdPlaylist._id)
        await channel.save()
        res.status(201).json({
            success: true,
            message: `Playlist ${name} created successfully.`,
            playlist: createdPlaylist
        })
    }catch(error){
        next(error)
    }
}

// update the name of the playlist
export const updatePlaylist =  async (req, res, next) => {
    try{
        const { name } = req.body
        let playlist = await Playlist.findById(req.params.id).populate('videos', '-__v')
        if(!playlist) throw createError.NotFound("Playlist not found")
        playlist.name = name

        const updatedPlaylist = await playlist.save()
        res.status(201).json({
            success: true,
            message: `Playlist ${name} updated successfully.`,
            playlist: updatedPlaylist
        })
    }catch(error){
        next(error)
    }
}

// add a video to the playlist
export const addVideoToPlaylist =  async (req, res, next) => {
    try{
        const { playlistId, videoId } = req.body
        let playlist = await Playlist.findById(playlistId)
        if(!playlist) throw createError.NotFound("Playlist not found")
        let video = await Video.findById(videoId)
        if(!video) throw createError.NotFound("Video not found")
        if(playlist.videos.includes(videoId)) throw createError.BadRequest("Video already exists in the playlist.")
        playlist.videos.push(videoId)
        const updatedPlaylist = await playlist.save()
        res.status(200).json({
            success: true,
            message: "Video added to playlist successfully",
            playlist: updatedPlaylist
        })
    }catch(error){
        next(error)
    }
}

// create a playlist
export const removeVideoFromPlaylist =  async (req, res, next) => {
    try{
        const {playlistId, videoId} = req.body
        let playlist = await Playlist.findById(playlistId)
        if(!playlist) throw createError.NotFound("Playlist not found")

        if(!playlist.videos.includes(videoId)) throw createError.NotFound("Video doesn't exists in the playlist.")
        playlist.videos = playlist.videos.filter(video => video === videoId)
        const updatedPlaylist = await playlist.save()
        res.status(200).json({
            success: true,
            message: "Video removed from playlist successfully",
            playlist: updatedPlaylist
        })

    }catch(error){
        next(error)
    }
}

// delete a playlist
export const deletePlaylist =  async (req, res, next) => {
    try{
        let playlist = await Playlist.findById(req.params.id)
        if(!playlist) throw createError.NotFound("Playlist not found")


        const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            response: deletedPlaylist
        })

    }catch(error){
        next(error)
    }
}


// delete all playlist by channel
export const deleteAllPlaylistByChannel =  async (req, res, next) => {
    try{
        let channel = await Channel.findOne({owner: req.user._id})

        if(!channel) throw createError.NotFound("Channel not found")


        const deletedPlaylists = await Playlist.deleteMany({channel: channel._id})
        res.status(200).json({
            success: true,
            message: "All playlists deleted successfully",
            response: deletedPlaylists
        })

    }catch(error){
        next(error)
    }
}

