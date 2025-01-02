// Importing the Router function from the express framework
import { Router } from "express";
// Importing the uploadImage controller function for handling image uploads
import { uploadImage } from "../controllers/file.controller";

// Creating a new router instance for defining file-related routes
const fileRoutes = Router();

// Defining a POST route for uploading images
// The '/images' endpoint will trigger the uploadImage function from the controller
fileRoutes.route("/images").post(uploadImage);

// Exporting the fileRoutes so it can be used in other parts of the application
export default fileRoutes;
