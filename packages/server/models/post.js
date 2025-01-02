// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Extract the ObjectId type from the mongoose schema types for referencing other documents
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String, // Field for the content of the post
      required: true, // The post must contain text
      maxlength: 120, // Maximum length of the post text
    },
    author: {
      type: ObjectId, // Reference to the User who created the post
      ref: "User", // Specifies that this field references the User model
    },
    created: {
      type: Date, // Field for the creation date of the post
      default: Date.now, // Default value is the current date and time
    },
    likes: [
      {
        type: ObjectId, // Array of references to the User model for users who liked the post
        ref: "User", // Specifies that this field references the User model
        // author: { type: ObjectId, ref: "User" },
      },
    ],
    comments: [
      {
        text: {
          type: String, // Field for the content of a comment
          required: true, // Each comment must contain text
          maxlength: 120, // Maximum length of the comment text
        },
        author: {
          type: ObjectId, // Reference to the User who authored the comment
          ref: "User", // Specifies that this field references the User model
        },
        created: {
          type: Date, // Field for the creation date of the comment
          default: Date.now, // Default value is the current date and time
        },
      },
    ],
    //path set up for static file serving (default post image)
    image: {
      type: String, // Field for the URL or path of the post image
      default: "/images/default-post.jpg", // Default image if none is provided
    },
  },

  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

// Create the Post model based on the defined schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model for use in other parts of the application
export default Post;
