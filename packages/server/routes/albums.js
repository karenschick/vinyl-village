// routes/albums.js
import express from "express";
import Album from "../models/album";
import { User } from "../models";
import { requireAuth } from "../middleware";
import { Express } from "express";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const sortAlbum = req.query.sortBy || "albumTitle";
  const username = req.query.username; // Get the username from query params

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const albums = await Album.find({ author: user._id }).sort({ [sortAlbum]: 1 });
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
