import express from "express";
import albums from "../albumDB";

const albumRouter = express.Router();

albumRouter.get("/", (req, res, next) => {
  res.status(200).send("api endpoint");
});

//route to get array of albums
albumRouter.get("/albums", async (req, res) => {
  try {
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = albumRouter;
