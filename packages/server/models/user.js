// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";
// Extract the ObjectId type from the mongoose schema types for referencing other documents
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String, // Field for the user's username
    unique: true, // Ensures that each username is unique across the collection
    required: true, // The username is required for a valid user
  },
  passwordHash: {
    type: String, // Field for storing the hashed password
    required: true, // The password hash is required for a valid user
  },
  email: {
    type: String, // Field for the user's email address
    required: true, // The email is required for a valid user
    // Using a regex pattern to validate the format of the email address
    pattern: "[a-z0-9]+@[a-z]+.[a-z]{2,3}",
  },
  profile_image: {
    type: String, // Field for the user's profile image URL or path
    default: "/albumorange.jpg", // Default profile image if none is provided
  },
  firstName: {
    type: String, // Field for the user's first name
    required: true, // The first name is required for a valid user
  },
  lastName: {
    type: String, // Field for the user's last name
    required: true, // The last name is required for a valid user
  },
  city: {
    type: String, // Field for the user's city of residence
    required: true, // The city is required for a valid user
  },
  state: {
    type: String, // Field for the user's state of residence
    required: true, // The state is required for a valid user
  },
  // Array of references to the Post model for posts created by the user
  posts: [
    {
      type: ObjectId, // Type for referencing other documents
      ref: "Post", // Specifies that this field references the Post model
    },
  ],
  // Array of references to the Post model for posts liked by the user
  postLikes: [
    {
      type: ObjectId, // Type for referencing other documents
      ref: "Post", // Specifies that this field references the Post model
    },
  ],
  // Array of references to the Album model for albums created by the user
  albums: [
    {
      type: ObjectId, // Type for referencing other documents
      ref: "Album", // Specifies that this field references the Album model
    },
  ],
});

// Create the User model based on the defined schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
