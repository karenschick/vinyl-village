// models/album.js
import mongoose from "mongoose";

const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 1889 && year <= currentYear;
};

const albumSchema = new mongoose.Schema({
  albumTitle: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
    validate: [validateYear, "Invalid year"],
  },
  artistName: {
    type: String,
    required: true,
  },
  bandMembers: [
    {
      memberName: String,
    },
  ],
  tracks: {
    type: [
      {
        trackTitle: {
          type: String,
          required: [true, "Track title is required"],
        },
        trackNumber: Number,
        trackDuration: {
          type: Number,
          required: [true, "Track duration is required"],
          min: [0, "Track duration must be non-negative"],
        },
      },
    ],
    validate: {
      validator: function (tracks) {
        if (tracks.length === 0) {
          return false;
        }
        return tracks.every((track) => {
          return track.trackTitle && track.trackDuration > 0;
        });
      },
      message: "Each track must have a valid title and duration greater than 0",
    },
  },
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
