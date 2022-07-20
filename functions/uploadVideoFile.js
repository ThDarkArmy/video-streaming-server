import multer from "multer";
import {
  VIDEO_FILE_UPLOAD_PATH,
  THUMBNAIL_FILE_UPLOAD_PATH,
} from "../constants";

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEO_FILE_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueSuffix +
        "_" +
        file.fieldname +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

export const uploadVideoFile = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] == "video") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only valid video files are allowed"));
    }
  },
}).single("video");

const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, THUMBNAIL_FILE_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "_" +
        uniqueSuffix +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

export const uploadThumbnailFile = multer({
  storage: thumbnailStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only valid image files are allowed"));
    }
  },
}).single("thumbnail");
