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
  tracks: [
    {
      trackTitle: { type: String, required: true },
      trackNumber: Number,
      trackDuration: { type: Number, required: true, min: 0 },
    },
  ],
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
