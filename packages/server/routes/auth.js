import express from "express"; // Importing the express framework
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { User } from "../models/index.js"; // Importing the User model
import keys from "../config/keys.js"; // Importing configuration keys (e.g., JWT secret)
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for creating tokens

const router = express.Router(); // Creating an express router instance

// Basic route to test the authentication endpoint
router.route("/").get((req, res, next) => {
  res.send("auth endpoint"); // Sending a simple response for testing
});

// Route for user signup
router.post("/signup", async (req, res) => {
  // Destructuring the request body to get user details
  const {
    username,
    password,
    confirmPassword,
    email,
    profile_image,
    firstName,
    lastName,
    city,
    state,
  } = req.body;

  // Check if required fields are provided
  if (!password || !username || !email) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  // Validate password length
  if (
    password.length < 8 ||
    password.length > 20 ||
    confirmPassword.length < 8 ||
    confirmPassword.length > 20
  ) {
    return res.status(422).json({
      error: "must be 8-20 characters",
    });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(422).json({
      error: " passwords do not match",
    });
  }

  // Check if user already exists with the same username or email
  User.findOne({ $or: [{ username: username }, { email: email }] })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that name" });
      }
      // Hash the password for security
      bcrypt.hash(password, 12).then((hashedpassword) => {
        // Create a new user instance
        const user = new User({
          username,
          email,
          passwordHash: hashedpassword, // Store the hashed password
          profile_image,
          firstName,
          lastName,
          city,
          state,
        });

        // Save the new user to the database
        user
          .save()
          .then((user) => {
            // Respond with success message and user info
            res.json({
              message: "saved successfully",
              username: user.username,
              email: user.email,
              profile_image: user.profile_image,
            });
          })
          .catch((err) => {
            console.error("Error saving user:", err); // Log the error
            res.status(500).json({ error: "Internal server error" }); // Respond with server error
          });
      });
    })
    .catch((err) => {
      console.log(err); // Log any errors that occurred while checking for existing users
    });
});

// Route for user sign-in
router.post("/signin", async (req, res) => {
  const { username, password } = req.body; // Destructuring request body to get username and password
  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(422).json({ error: "missing username or password" });
  }

  // Find the user by username
  const user = await User.findOne({ username: username });
  // Check if the password is correct by comparing with the stored hash
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // If the user is not found or the password is incorrect
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  // Prepare user data for JWT token
  const userForToken = {
    username: user.username,
    id: user._id, // Use the user ID as part of the token payload
  };

  // Create a JWT token with user information
  const token = jwt.sign(userForToken, keys.jwt.secret);
  // Respond with the token and user information
  res
    .status(200)
    .send({ token, username, uid: user.id, profile_image: user.profile_image });
});

// Exporting the router to use in other parts of the application
export default router;

