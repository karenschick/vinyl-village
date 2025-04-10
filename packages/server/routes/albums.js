// routes/albums.js
import express from "express"; // Importing the express framework
import Album from "../models/album.js"; // Importing the Album model
import { User } from "../models/index.js"; // Importing the User model
import requireAuth from "../middleware/requireAuth.js"; // Importing middleware for authentication
import { v4 as uuidv4 } from "uuid"; // Importing uuid to generate unique IDs
import path from "path"; // Importing path module for file path operations

// Creating a router instance from express
const router = express.Router();

// Route to search for albums based on various query parameters
router.get("/search", async (req, res) => {
  try {
    // Extracting query parameters from the request
    const {
      albumTitle,
      artistName,
      bandMember,
      trackTitle,
      releaseYear,
      condition,
    } = req.query;

    // Array to hold query conditions
    let queryConditions = [];
    // Adding conditions based on provided query parameters
    if (albumTitle)
      queryConditions.push({ albumTitle: new RegExp(albumTitle, "i") }); // Case-insensitive search for album title
    if (artistName)
      queryConditions.push({ artistName: new RegExp(artistName, "i") }); // Case-insensitive search for artist name
    if (bandMember)
      queryConditions.push({
        bandMembers: {
          $elemMatch: { memberName: new RegExp(bandMember, "i") }, // Case-insensitive search for band members
        },
      });
    if (trackTitle)
      queryConditions.push({
        "tracks.trackTitle": new RegExp(trackTitle, "i"), // Case-insensitive search for track title
      });
    if (releaseYear) {
      const year = parseInt(releaseYear); // Convert to number
      if (!isNaN(year)) {
        queryConditions.push({ releaseYear: year }); // Add release year condition if valid
      }
    }
    if (condition) queryConditions.push({ condition: new RegExp(condition) }); // Case-insensitive search for condition

    // Check if at least one query condition is provided
    if (queryConditions.length === 0) {
      return res
        .status(400)
        .json({ error: "Must provide at least one search parameter" });
    }

    // Find albums matching the query conditions and populate author details
    const albums = await Album.find({ $and: queryConditions }).populate(
      "author",
      "firstName lastName username city profile_image state "
    );
    // Respond with the found albums
    res.json(albums);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a generic error message
  }
});

// Route to get albums of a specific user
router.get("/", requireAuth, async (req, res) => {
  const sortAlbum = req.query.sortBy || "albumTitle"; // Default sort by album title if not specified
  const username = req.query.username; // Get the username from query parameters

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Respond if user is not found
    }

    // Find albums authored by the user and sort them
    const albums = await Album.find({ author: user._id }).sort({
      [sortAlbum]: 1, // Sort by specified field
    });
    res.json(albums); // Respond with the found albums
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a generic error message
  }
});

// Route to create a new album
router.post("/", requireAuth, async (req, res) => {
  const { user } = req; // Get the authenticated user from the request
  // Prepare album data from the request body, parsing tracks and band members as arrays
  const newAlbumData = {
    ...req.body,
    tracks: JSON.parse(req.body.tracks || "[]"), // Default to empty array if not provided
    bandMembers: JSON.parse(req.body.bandMembers || "[]"), // Default to empty array if not provided
  };

  // Create a new Album instance with the user as the author
  const newAlbum = new Album({
    ...newAlbumData, // Spread syntax to copy all album data
    author: user._id, // Associate album with logged-in user
  });

  // Check if an image file is uploaded
  if (req.files && req.files.image) {
    const albumImage = req.files.image; // Get the uploaded image
    const imageName = uuidv4() + path.extname(albumImage.name); // Use uuidv4() to generate a unique file name
    const uploadPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      imageName // Construct the path for saving the image
    );
    await albumImage.mv(uploadPath); // Move the uploaded file to the designated path
    newAlbum.image = `/images/${imageName}`; // Set the image path in the album object
  }

  try {
    await newAlbum.save(); // Save the new album to the database
    res.status(201).json(newAlbum); // Respond with the created album and status 201 (Created)
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message }); // Respond with validation errors if any
    }
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a generic error message
  }
});

// Route to delete an album by ID
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Album.findByIdAndRemove(req.params.id); // Remove the album from the database using its ID
    res.status(204).send(); // Respond with status 204 (No Content)
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a generic error message
  }
});

// Export the router to use in other parts of the application
export default router;
