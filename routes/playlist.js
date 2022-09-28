import { Router } from 'express'
import { AuthenticateUser } from "../middlewares/AuthMiddleware";
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    getAllPlaylistByChannel,
    deleteAllPlaylistByChannel
} from "../controllers/PlaylistController";

const router = Router()

router.get("/byId/:id", getPlaylistById)
router.get("/byChannel/:id", getAllPlaylistByChannel)
router.post("/",AuthenticateUser, createPlaylist)
router.put("/:id",AuthenticateUser, updatePlaylist)
router.post("/addVideo",AuthenticateUser, addVideoToPlaylist)
router.post("/removeVideo", AuthenticateUser, removeVideoFromPlaylist)
router.delete("/:id",AuthenticateUser, deletePlaylist)
router.delete("/delete/all", AuthenticateUser, deleteAllPlaylistByChannel)


export default router