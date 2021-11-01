import Comment from '../models/Comment'

export const deleteAllCommentsByVideo = async (videoId) => {
    return Comment.deleteMany({video: videoId});
}