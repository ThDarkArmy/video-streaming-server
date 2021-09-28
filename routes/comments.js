import { Router } from "express"
import { getCommentById, deleteCommentById, postComment, updateCommentById, getCommentByVideo} from '../controllers/CommentController'
import { commentValidation } from "../validators/CommentValidator";
import { AuthenticateUser } from "../middlewares/AuthMiddleware"

const router = Router()

router.get("/byId/:id", getCommentById)
router.get("/byVideo/:videoId", getCommentByVideo)
router.post("/",AuthenticateUser, commentValidation, postComment)
router.put("/:commentId",AuthenticateUser, commentValidation, updateCommentById)
router.delete("/:commentId",AuthenticateUser, deleteCommentById)



export default router
