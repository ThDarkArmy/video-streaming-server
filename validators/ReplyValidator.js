import { check } from "express-validator";

const replyText = check("replyText", "Reply text must not be empty.").not().isEmpty()
const comment = check("comment", "Comment id is not valid.").isLength({min:14, max:14})


export const replyValidator = [replyText, comment]
export const onUpdateReplyValidator = [replyText]