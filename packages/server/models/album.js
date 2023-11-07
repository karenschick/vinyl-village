import mongoose from "mongoose";
//const { ObjectId } = mongoose.Schema.Types;

const albumSchema = new mongoose.Schema({
  albumTitle: {
    type: String,
    unique: true,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  bandMembers: [
    {
      memberName: String,
      required: false,
    },
  ],
  tracks: [
    {
      trackTitle: String,
      trackNumber: Number,
      trackDuration: String,
      required: true,
    },
  ],
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
