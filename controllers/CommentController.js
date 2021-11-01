import Comment from '../models/Comment'
import Video from '../models/Video'
import createError from 'http-errors'


// find comment by id
export const getCommentById = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.id)
        if(!comment) throw createError.NotFound("Comment with given id not found.")
        res.status(200).json({
            success: true,
            message: "Comment found",
            comment: comment
        })
    }catch(err){
        next(err)
    }
}

// find comments by video
export const getCommentByVideo = async (req, res, next) => {
    try{
        const comments  = await Comment.find({video: req.params.id})
        res.status(200).json({
            success: true,
            message: "Comments on provided video",
            comments: comments
        })
    }catch(err){
        next(err)
    }
}


// post comment on video
export const postComment = async (req, res, next) => {
    try{
        const { videoId, commentText} = req.body
        let video = await Video.findById(videoId)
        if(!video) throw createError.BadRequest("Video does not exist.")
        const comment = new Comment({
            video:videoId,
            commentText,
            user: req.user.id
        })

        const savedComment = await comment.save()
        video.comments.push(savedComment._id)
        await video.save()
        res.status(201).json({
            success: true,
            message: "Comment posted successfully",
            comment: savedComment
        })
    }catch(err){
        next(err)
    }
}


// update a comment by id
export const updateCommentById = async (req, res, next) => {
    try{
        const { commentText } = req.body
        let comment = await Comment.findById(req.params.id)
        if(!comment) throw createError.NotFound("Comment not found")

        comment.commentText = commentText

        const updatedComment = await comment.save()

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        })

    }catch(err){
        next(err)
    }
}


// delete a comment by id
export const deleteCommentById = async (req, res, next) => {
    try{
        let comment = await Comment.findById(req.params.id)
        if(!comment) throw createError.NotFound("Comment not found")
        let video = await Video.findById(comment.video)

        const deletedComment = await Comment.findByIdAndDelete(req.params.id)
        video.comments = video.comments.filter(cmt => cmt.toString()!==req.params.id.toString())
        await video.save()
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            response: deletedComment
        })
    }catch(err){
        next(err)
    }
}

