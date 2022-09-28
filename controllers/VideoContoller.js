import createError from "http-errors";
import path from "path";
import fs from "fs-extra";
import { getVideoDurationInSeconds } from "get-video-duration";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);
import extractFrames from "ffmpeg-extract-frames";
import {
  BASE_URL,
  VIDEO_FILE_UPLOAD_PATH,
  THUMBNAIL_FILE_UPLOAD_PATH,
} from "../constants";

import Video from "../models/Video";
import Channel from "../models/Channel";
import Playlist from "../models/Playlist";

// get all videos, only for admins and super admins
export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({}).select("-__v").populate("channel").exec();
    res.status(200).json({success: true, message: "All Videos",body: videos });
  } catch (error) {
    next(error);
  }
};

// get all videos by channel
export const getAllVideosByChannel = async (req, res, next) => {
  try {
    const videos = await Video.find({ channel: req.params.id }).populate("channel");
    res.status(200).json({
      success: true,
      message: "Videos on this channel",
      body: videos,
    });
  } catch (error) {
    next(error);
  }
};

// get all videos by playlist
export const getAllVideosByPlaylist = async (req, res, next) => {
  try {
    const videos = await Video.find({ playlist: req.params.id });
    res.status(200).json({
      success: true,
      message: "Videos in this playlist",
      body: videos,
    });
  } catch (error) {
    next(error);
  }
};

// get all videos by category
export const getAllVideosByCategory = async (req, res, next) => {
  try {
    const videos = await Video.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      message: "Videos of category " + req.params.category,
      body: videos,
    });
  } catch (err) {
    next(err);
  }
};

// get all videos by search query
export const getAllVideosBySearchQuery = (req, res, next) => {};

// get a video by id, only for admins and super admins
export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).select("-__v").populate("channel");
    res.status(200).json({
      success: true,
      message: "Video",
      body: video,
    });
  } catch (error) {
    next(error);
  }
};


// uploading a video
export const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, category, tags, playlist } =
      req.body;

      console.log("Uploading video", req.body);

    const channel = await Channel.findOne({ user: req.user.id });

    if (!channel) throw createError.NotFound("Channel does not exist.");

    let playlistModel = null;
    if (playlist) {
      playlistModel = await Playlist.findById(playlist);
      // if (!playlistModel) throw createError.NotFound("Playlist not found.");
    }else{
      playlistModel = await Playlist.findOne({name: "Default Playlist", channel: channel._id});
    }

    const videoPath = VIDEO_FILE_UPLOAD_PATH + req.file.filename;
    const { size } = await fs.statSync(videoPath);
    const duration = await getVideoDurationInSeconds(videoPath);

    const thumbnailFileName = req.file.filename.split(".")[0] + "_thumbnail.jpg"

    const thumbnailPath = path.join(THUMBNAIL_FILE_UPLOAD_PATH, thumbnailFileName);

    // generating screenshots of video
    await extractFrames({
      input: videoPath,
      output: thumbnailPath,
      offsets: [7000],
    });

    let video = new Video({
      title,
      description,
      category,
      tags,
      channel: channel._id,
      videoPath,
      thumbnailPath,
      thumbnailStreamingPath: BASE_URL + "/" + THUMBNAIL_FILE_UPLOAD_PATH+"/"+thumbnailFileName,
      duration,
      playlist: playlistModel._id,
      size: (size / (1024 * 1024)).toFixed(2),
      mimeType: req.file.mimetype,
    });

    video.videoStreamingPath = BASE_URL + "/videostream/" + video._id;

    const uploadedVideo = await video.save();

    channel.videos.push(video._id);
    await channel.save()

    if (playlistModel) {
      playlistModel.videos.push(video._id);
      await playlistModel.save();
    }

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      body: uploadedVideo,
    });
  } catch (err) {
    next(err);
  }
};



// Update a video by id
export const updateVideoDescription = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    let video = await Video.findById(req.params.id);

    if (!video) throw createError.NotFound("Video with given id not found.");

    let newVideo = new Video({
      _id: req.params.id,
      title,
      description,
      category,
      path: video.path,
      duration: video.duration,
      size: video.size,
      type: video.type,
    });
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: newVideo },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Video updated successfully.",
      body: updatedVideo,
    });
  } catch (error) {
    next(error);
  }
};

// updating the thumbnail of the video
export const updateThumbnail = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    console.log(req.file.mimetype);
    if (!video) throw createError.NotFound("Video does not exist");
    await fs.unlinkSync(video.thumbnailPath);

    video.thumbnailPath = path.join(THUMBNAIL_FILE_UPLOAD_PATH, req.file.filename);
    video.thumbnailStreamingPath = THUMBNAIL_FILE_UPLOAD_PATH+"/"+req.file.filename;

    const updatedVideo = await video.save();

    res.status(200).json({
      success: true,
      message: "Thumbnail updated successfully",
      body: updatedVideo,
    });
  } catch (err) {
    next(err);
  }
};

// delete a video by id
export const deleteVideo = async (req, res, next) => {
  try {
    let video = await Video.findById(req.params.id);

    if (!video) throw createError.NotFound("Video with given id not found.");
    await fs.unlinkSync(video.videoPath);
    await fs.unlinkSync(video.thumbnailPath);

    let response = await Video.findByIdAndRemove(
      req.params.id.toString().trim()
    );
    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      body: response,
    });
  } catch (error) {
    next(error);
  }
};

// delete all videos, only for super admin
export const deleteAllVideos = async (req, res, next) => {
  try {
    console.log(req.user.roles);
    let response = await Video.deleteMany({});

    // deleting all videos
    fs.readdir(uploadPath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(uploadPath, file), (err) => {
          if (err) throw err;
        });
      }
    });

    // deleting all thumbnails
    fs.readdir(thumbnailsPath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(thumbnailsPath, file), (err) => {
          if (err) throw err;
        });
      }
    });
    res.status(200).json({
      success: true,
      message: "All videos deleted successfully",
      body: response,
    });
  } catch (error) {
    next(error);
  }
};
