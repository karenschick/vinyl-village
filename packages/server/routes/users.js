import express from "express"; // Importing Express framework
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { User } from "../models/index.js"; // Importing the User model
import requireAuth from "../middleware/requireAuth.js"; // Importing authentication middleware

const router = express.Router(); // Creating a new router instance

// Route to get user details by username or update user details
router
  .route("/:username")
  .get(async (req, res) => {
    const { username } = req.params; // Extracting username from request parameters
    const populateQuery = {
      path: "posts", // Populating posts associated with the user
      populate: { path: "author", select: ["username", "profile_image"] }, // Populating authors of the posts
    };
    // Finding the user by username and populating the defined fields
    const user = await User.findOne({ username }).populate(populateQuery);
    if (!user) {
      return res.status(404).json({ error: "user not found" }); // Sending 404 if user not found
    }
    res.json(user.toJSON()); // Sending the user details as JSON
  })

  // PUT route to update user details, requiring authentication
  .put(requireAuth, async (req, res) => {
    const {
      password,
      currentPassword,
      confirmPassword,
      firstName,
      lastName,
      email,
      city,
      state,
    } = req.body; // Extracting user details from request body
    const { username } = req.params; // Extracting username from request parameters

    const user = await User.findOne({ username: username }); // Finding the user by username
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Sending 404 if user not found
    }

    // Checking if password fields are provided for update
    if (password || currentPassword || confirmPassword) {
      if (password.length < 8 || password.length > 20) {
        return res
          .status(422)
          .json({ error: "Password must be 8-20 characters long" }); // Validating password length
      }

      if (password !== confirmPassword) {
        return res.status(422).json({ error: "Passwords do not match" }); // Validating password match
      }

      // Checking if the provided current password matches the stored password hash
      const passwordCorrect = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!passwordCorrect) {
        return res.status(401).json({ error: "Invalid current password" }); // Sending 401 if current password is incorrect
      }

      user.passwordHash = await bcrypt.hash(password, 12); // Hashing the new password and updating it
    }

    // Updating other user fields if provided, otherwise keeping current values
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.city = city || user.city;
    user.state = state || user.state;

    try {
      await user.save(); // Saving the updated user details
      res.json(user.toJSON()); // Sending the updated user details as JSON
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" }); // Sending 500 status on error
    }
  });

//PUT /users/:username/avatar - update user avatar
// PUT route to update user avatar, requiring authentication
router.put("/:username/avatar", requireAuth, async (req, res) => {
  try {
    const { username } = req.params; // Extracting username from request parameters
    const { profile_image } = req.body; // Extracting profile image from request body

    // Checking if the authenticated user's username matches the username in the URL
    if (req.user.username.toLowerCase() !== username.toLowerCase()) {
      return res.status(401).json({ error: "Unauthorized" }); // Sending 401 if unauthorized
    }
    const user = await User.findOne({ username }); // Finding the user by username

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Sending 404 if user not found
    }

    user.profile_image = profile_image; // Updating the user's profile image

    await user.save(); // Saving the updated user details
    res.json(user.toJSON()); // Sending the updated user details as JSON
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Sending 500 status on error
  }
});

// Exporting the router for use in other parts of the application
export default router;
;
