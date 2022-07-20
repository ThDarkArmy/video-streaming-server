import { Router } from "express";
import { videoValidation } from "../validators/VideoValidator";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";
import ValidationMiddleware from "../middlewares/ValidatorMiddleware";
import { assertRole } from "../middlewares/AuthMiddleware";

const {
  getAllVideos,
  getAllVideosByCategory,
  getAllVideosByChannel,
  getAllVideosByPlaylist,
  getAllVideosBySearchQuery,
  getVideoById,
  updateVideoDescription,
  updateThumbnail,
  deleteVideo,
  deleteAllVideos,
  uploadVideo,
} = require("../controllers/VideoContoller");



import { uploadThumbnailFile, uploadVideoFile } from "../functions/uploadVideoFile";

const router = Router();

// get all videos
router.get(["/", "/all"], getAllVideos);

// get a specific video by id
router.get("/byId/:id", getVideoById);

// get videos by channel
router.get("/byChannel/:id", getAllVideosByChannel);

// get videos by playlist
router.get("/byPlaylist/:id", getAllVideosByPlaylist);

// get videos by category
router.get("/byCategory/:category", getAllVideosByCategory);

// upload video to server
router.post(
  "/upload",
  AuthenticateUser,
  uploadVideoFile,
  videoValidation,
  ValidationMiddleware,
  uploadVideo
);


// update a video on server
router.put(
  "/:id",
  AuthenticateUser,
  videoValidation,
  ValidationMiddleware,
  updateVideoDescription
);

// update thumbnail of a video to server
router.patch("/update-thumbnail/:id", AuthenticateUser, uploadThumbnailFile, updateThumbnail);

// delete an specific video by id from server
router.delete("/:id", AuthenticateUser, deleteVideo);

// delete all videos
router.delete(
  "/",
  AuthenticateUser,
  assertRole(["SUPERADMIN"]),
  deleteAllVideos
);

export default router;
