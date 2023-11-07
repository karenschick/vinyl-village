import express from "express";
import { Album } from "../models/album";

const router = express.Router();

// router.get('/', (req, res, next) => {
//     res.status(200).send('api endpoint')
//   })

//route to get array of albums
router.get('/albums', async (req, res) => {
  try {
    //fecth albums using mongoose model
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
