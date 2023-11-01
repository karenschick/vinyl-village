import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const albumSchema = new mongoose.Schema({
  albumTitle: {
    type: String,
    unique: true,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 4,
    max: 4,
  },
  songTitle: {
    type: String,
    required: true,
  },
  songDuration: {
    type: Number,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  bandMembers:{
    type: String,
    required: false,
  }

}
);

const Album = mongoose.model("Album", albumSchema);

export default Album;
