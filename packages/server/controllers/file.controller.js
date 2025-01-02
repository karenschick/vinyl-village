import { error } from "console"; // Importing the `error` function from the console module
import path from "path"; // Node.js module to work with file and directory paths
import { uuid } from "uuidv4"; // Importing the `uuid` function to generate unique identifiers

// Function to handle image uploads
export async function uploadImage(req, res, next) {
  // Log the incoming files from the request for debugging purposes
  console.log(req.files);

  // Check if no files are included in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    // Respond with a 400 status code and error message if no files are uploaded
    return res.status(400).json({ error: "No files Uploaded" });
  }

  // Access the uploaded file(s). Assumes the file field in the request is named 'files'
  const image = req.files.files;

  // Generate a unique name for the uploaded image using UUID
  // Appends the original file extension to the generated name
  const generatedImageName = uuid() + "." + image.name.split(".").at(-1);

  // Define the path to save the uploaded image in the "public/images" directory
  const uploadPath = path.join(
    // Current directory of the script
    "..", // Go up one directory level
    "public", // Target directory for public assets
    "images", // Subdirectory for images
    generatedImageName // File name for the uploaded image
  );

  // Move the uploaded file to the specified directory
  image.mv(uploadPath, (error) => {
    if (error) {
      // If an error occurs during the file move, respond with a 500 status code
      return res.sendStatus(500);
    }
    // If the upload is successful, respond with the path of the uploaded image
    res.json({ path: `/images/${generatedImageName}` });
  });
}
