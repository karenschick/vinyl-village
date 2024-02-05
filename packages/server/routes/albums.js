// routes/albums.js
import express from "express";
import Album from "../models/album";
import { User } from "../models";
import { requireAuth } from "../middleware";
import { Express } from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { albumTitle, artistName, bandMember, trackTitle, releaseYear } = req.query;

    let queryConditions = [];
    if (albumTitle) queryConditions.push({ albumTitle: new RegExp(albumTitle, 'i') });
    if (artistName) queryConditions.push({ artistName: new RegExp(artistName, 'i') });
    if (bandMember) queryConditions.push({ bandMembers: { $elemMatch: { memberName: new RegExp(bandMember, 'i') } } });
    if (trackTitle) queryConditions.push({ 'tracks.trackTitle': new RegExp(trackTitle, 'i') });
    if (releaseYear) queryConditions.push({ releaseYear });

    if (queryConditions.length === 0) {
      return res.status(400).json({ error: "Must provide at least one search parameter" });
    }

    const albums = await Album.find({ $or: queryConditions }).populate('author', 'firstName lastName username city profile_image state');
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/", requireAuth, async (req, res) => {
  const sortAlbum = req.query.sortBy || "albumTitle";
  const username = req.query.username; // Get the username from query params

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const albums = await Album.find({ author: user._id }).sort({
      [sortAlbum]: 1,
    });
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { user } = req;
    const newAlbumData = req.body;
    const newAlbum = new Album({
      ...newAlbumData, // Spread syntax to copy all album data
      author: user._id, // Associate album with logged-in user
    });
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Album.findByIdAndRemove(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
