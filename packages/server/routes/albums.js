// routes/albums.js
import express from "express";
import Album from "../models/album";

const albumRouter = express.Router();

albumRouter.get("/albums", async (req, res) => {
  const sortAlbum = req.query.sortBy || "albumTitle" || "releaseYear" || "artistName"
  try {
    const albums = await Album.find().sort({ [sortAlbum]: 1 });
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

albumRouter.post("/albums", async (req, res) => {
  try {
    const newAlbumData = req.body;
    const newAlbum = new Album(newAlbumData);
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

albumRouter.delete("/albums/:id", async (req, res)=>{
  try{
    await Album.findByIdAndRemove(req.params.id)
    res.status(204).send()
  } catch(error){
    console.error(error)
    res.status(500).json({error: "Internal Server Error"})
  }
})

export default albumRouter;
