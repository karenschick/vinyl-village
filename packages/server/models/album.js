// models/album.js
import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  albumId: { type: Number, required: true },
  albumTitle: {
    type: String,
    // unique: true,
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
    },
  ],
  tracks: [
    {
      trackTitle: String,
      trackNumber: Number,
      trackDuration: String,
    },
  ],
});

const Album = mongoose.model('Album', albumSchema);

export default Album;
