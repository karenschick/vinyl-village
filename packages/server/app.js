
import "dotenv/config"; // Import environment variables from the .env file
import express from "express"; // Web framework for Node.js
import path from "path"; // Module for working with file and directory paths
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import logger from "morgan"; // HTTP request logger middleware
import cors from "cors"; // Middleware for enabling CORS (Cross-Origin Resource Sharing)
import mongoose from "mongoose"; // MongoDB object modeling tool
import keys from "./config/keys.js"; // Configuration keys (e.g., database URL, API endpoint)
import router from "./routes/index.js";
import { requestLogger } from "./middleware/index.js"; // Custom middleware for logging requests and handling errors
import fileUpload from "express-fileupload"; // Middleware for handling file uploads
import { errorHandler } from "./middleware/index.js";
import createError from "http-errors"; // Module for creating HTTP errors// Connect to MongoDB using Mongoose
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB using Mongoose
mongoose.connect(keys.database.url, {
  useNewUrlParser: true, // Use the new URL parser
  useUnifiedTopology: true, // Use the new unified topology engine
  // useFindAndModify: false, // Deprecated: prevent MongoDB from using findAndModify() for findOneAndUpdate()
  // useCreateIndex: true, // Deprecated: ensure that Mongoose uses createIndex() instead of ensureIndex()
});

// Event listener for successful connection to MongoDB
mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB"); // Log connection success
});

// Event listener for connection errors
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err); // Log connection errors
});

// Create an Express application
const app = express();

// middleware setup
app.use(logger("dev")); // Log HTTP requests in the 'dev' format
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies from the request
app.use("/vinyl-village", express.static(path.join(__dirname, "../client/dist"))); // Serve static files from the "public" directory
app.use(requestLogger); // Custom middleware for logging requests
app.use(fileUpload()); // Enable file upload handling

// API router setup
app.use(keys.app.apiEndpoint, router); // Mount the router on the specified API endpoint

// fallback route for react router
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith(keys.app.apiEndpoint)) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Catch 404 errors and forward to the error handler
app.use((req, res, next) => {
  next(createError(404, "NotFound")); // Create a 404 error if no route matches
});

// err// Error handler middleware
app.use(errorHandler); // Custom error handler to manage errors

// Export the Express application
export default app;
