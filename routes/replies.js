import { Router } from "express"
import {AuthenticateUser} from "../middlewares/PassportMiddleware";
import { replyValidator } from "../validators/ReplyValidator";
import { getRepliesByComment, getAllReplies, postReplyOnComment, updateReplyById, deleteAllRepliesByComment, deleteReplyById} from "../controllers/ReplyController"


const router = Router()

router.get("/all", getAllReplies)
router.get("/byComment/:id", getRepliesByComment)
router.post("/",AuthenticateUser, replyValidator, postReplyOnComment)
router.put("/:id",AuthenticateUser, replyValidator, updateReplyById)
router.delete("/:id",AuthenticateUser, deleteReplyById)
router.delete("/deleteByComment/:id",AuthenticateUser, deleteAllRepliesByComment)


export default router