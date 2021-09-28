import { check } from "express-validator";
// import { ObjectID} from "mongodb"


// false
//ObjectID.isValid("5e63c3a5e4232e4cd0274ac2")

const commentText = check("commentText", "Comment cannot be empty").not().isEmpty()
const video = check("video", "Video id is not valid").isLength({min:14, max: 14})

export const commentValidation = [commentText, video]

