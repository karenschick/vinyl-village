import jwt from "jsonwebtoken"; // Import JSON Web Token library for token verification
import mongoose from "mongoose"; // Import Mongoose for database interactions (not used in this file)
import keys from "../config/keys.js"; // Import configuration keys (e.g., secret key for JWT)
import { User } from "../models/index.js"; // Import the User model for database queries

// Middleware to verify the user's authentication
export default async (req, res, next) => {
  // Retrieve the authorization header from the incoming request
  const authorization = req.get("authorization"); // Expected format: "Bearer <token>"
  // authorization === Bearer ewefwegwrherhe
  // If no authorization header is present, respond with a 401 Unauthorized status
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }

  // Extract the token by removing the "Bearer " prefix
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, keys.jwt.secret, (err, payload) => {
    if (err) {
      // If token verification fails, respond with a 401 Unauthorized status
      return res.status(401).json({ error: "you must be logged in" });
    }
    // Extract the user ID from the token payload
    const { id } = payload;
    // Query the database to find the user by their ID
    User.findById(id).then((userdata) => {
      // Attach the user data to the request object for downstream middleware or handlers
      req.user = userdata;
      
      // Call the next middleware in the chain
      next();
    });
  });
};
