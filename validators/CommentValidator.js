import { check } from "express-validator";

const commentText = check("commentText", "Comment cannot be empty").not().isEmpty()
const video = check("videoId", "Video id is not valid").isLength({min:24, max: 24})

export const commentValidation = [commentText, video]
export const onUpdateCommentValidation = [commentText]

