import { Router } from "express"
import { getCommentById, deleteCommentById, postComment, updateCommentById, getCommentByVideo} from '../controllers/CommentController'
import {commentValidation, onUpdateCommentValidation} from "../validators/CommentValidator";
import { AuthenticateUser } from "../middlewares/AuthMiddleware"
import ValidationMiddleware from "../middlewares/ValidatorMiddleware";

const router = Router()

router.get("/byId/:id", getCommentById)
router.get("/byVideo/:id", getCommentByVideo)
router.post("/",AuthenticateUser, commentValidation, ValidationMiddleware, postComment)
router.put("/:id",AuthenticateUser, onUpdateCommentValidation,ValidationMiddleware, updateCommentById)
router.delete("/:id",AuthenticateUser, deleteCommentById)



export default router
