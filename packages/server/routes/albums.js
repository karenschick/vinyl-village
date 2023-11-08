import express from "express";
import { Album } from "../models/album";
import albums from "../albumDB"

const albumRouter = express.Router();

albumRouter.get('/', (req, res, next) => {
    res.status(200).send('api endpoint')
  })

//route to get array of albums
albumRouter.get('/albums', async (req, res) => {
  try {
    //fecth albums using mongoose model
    //const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get('/albums', async (req, res, next) => {

//   let album = await Album.findOne({}).exec();

//   if (!album) {
//     const newalbum = new album({
//       albumTitle: "",
//       releaseYear: Number,
//       artistName: "",
//       bandMembers: [
//         {
//           memberName: "",
//         },
//       ],
//       tracks: [
//         {
//           trackTitle: "",
//           trackNumber: Number,
//           trackDuration: "",
          
//         },
//       ],
//     });
    
//     album = await newalbum.save()
//   }

//   res.status(200).send(user)
// })

module.exports = albumRouter;
