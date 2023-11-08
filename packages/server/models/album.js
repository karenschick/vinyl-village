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
      String    
  ],
  tracks: [{
      trackTitle: String,
      trackNumber: Number,
      trackDuration: String, 
  },
],
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
