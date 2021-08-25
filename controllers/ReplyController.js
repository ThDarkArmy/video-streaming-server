import Reply from '../models/Reply'
import createError from 'http-errors'

// get all replies, only for admins
export const getAllReplies = async (req, res, next)=>{
    try{
        const replies = await Reply.find({})
        res.status(200).json({
            success: true,
            message: "All replies",
            replies: replies
        })
    }catch (error){
        next(error)
    }
}

// get all replies by comment
export const getRepliesByComment = async (req, res, next)=>{
    try{
        const replies = await Reply.find({comment: req.params.id})
        res.status(200).json({
            success: true,
            message: "Replies of the comment",
            replies: replies
        })
    }catch (error){
        next(error)
    }
}

// post reply on comment
export const postReplyOnComment = async (req, res, next)=>{
    try{
        const { comment, replyText} = req.body
        const savedReply = await new Reply({
            replyText,
            comment,
            user: req.user.id
        }).save()

        res.status(201).json({
            success: true,
            message: "Posted reply successfully",
            reply: savedReply
        })

    }catch (error){
        next(error)
    }
}

// update reply by id
export const updateReplyById = async (req, res, next)=>{
    try{
        const { comment, replyText} = req.body
        let reply = await Reply.findById(req.params.id)
        if(!reply) throw createError.NotFound("Reply with given id does not exist.")
        reply.replyText = replyText
        const updatedReply = await reply.save()

        res.status(200).json({
            success: true,
            message: "Reply updated successfully.",
            reply: updatedReply
        })
    }catch (error){
        next(error)
    }
}

// delete reply by id
export const deleteReplyById = async (req, res, next)=>{
    try{
        let reply = await Reply.findById(req.params.id)
        if(!reply) throw createError.NotFound("Reply with given id does not exist.")

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully.",
        })
    }catch (error){
        next(error)
    }
}

// delete all replies by comment
export const deleteAllRepliesByComment = async (req, res, next)=>{
    try{
        await Reply.deleteMany({comment: req.params.id})
        res.status(200).json({
            success: true,
            message: "All replies deleted successfully.",
        })
    }catch (error){
        next(error)
    }
}