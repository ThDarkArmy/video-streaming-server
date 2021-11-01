import Reply from '../models/Reply'

export const deleteRepliesByComment = (commentId) => {
    return Reply.deleteMany({comment: commentId})
}