import { Schema, model } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    views: {
        type: String, 
        default: 0 
    },
    description: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    backgroundImagePath: {
      type: String,
      default: process.env.defaultImagePath,
    },

    bannerImagePath: {
      type: String,
      default: process.env.defaultImagePath,
    },
    numberOfSubscribers: {
      type: Number,
      default: 0,
    },
    links: [
      {
        title: String,
        url: String,
      },
    ],
    // owner
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],

    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    subscription: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
  },
  { timestamps: true }
);

channelSchema.index({ name: "text", description: "text" });

export default model("Channel", channelSchema);
