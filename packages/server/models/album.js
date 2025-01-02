// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Extract the ObjectId type from the mongoose schema types
const { ObjectId } = mongoose.Schema.Types;

// Function to validate the release year of the album
const validateYear = (year) => {
  const currentYear = new Date().getFullYear(); // Get the current year
  // Validate that the year is between 1889 and the current year
  return year >= 1889 && year <= currentYear;
};

// Define the schema for the Album model
const albumSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectId, // Reference to the User model (author of the album)
      ref: "User", // Specifies that this field references the User model
    },
    created: {
      type: Date, // Field for the creation date of the album
      default: Date.now, // Default value is the current date and time
    },
    albumTitle: {
      type: String, // Field for the title of the album
      required: true, // Title is required
    },
    releaseYear: {
      type: Number, // Field for the release year of the album
      required: true, // Release year is required
      validate: [validateYear, "Invalid year"], // Custom validation function for the year
    },
    artistName: {
      type: String, // Field for the artist's name
      required: true, // Artist name is required
    },
    bandMembers: [
      {
        memberName: String, // Array of objects for band members, each with a member name
      },
    ],
    tracks: {
      // Array of track objects for the album
      type: [
        {
          trackTitle: {
            type: String, // Field for the title of the track
            required: [true, "Track title is required"], // Track title is required
          },
          trackNumber: Number, // Field for the track number (optional)
          trackDuration: {
            type: Number, // Field for the duration of the track in seconds
            required: [true, "Track duration is required"], // Duration is required
            min: [0, "Track duration must be non-negative"], // Duration must be non-negative
          },
        },
      ],
      validate: {
        // Custom validation for the tracks array
        validator: function (tracks) {
          // Ensure there is at least one track
          if (tracks.length === 0) {
            this.invalidate("tracks", "The album must have at least one track");
            return false; // Invalid if no tracks are provided
          }
          // Validate each track to ensure it has a valid title and duration
          return tracks.every((track) => {
            return track.trackTitle && track.trackDuration > 0; // Track must have a title and positive duration
          });
        },
        message:
          "Each track must have a valid title and duration greater than 0", // Error message for validation failure
      },
    },
    condition: {
      type: String, // Field for the condition of the album (e.g., Poor, Fair)
      required: true, // Condition is required
      enum: ["Poor", "Fair", "Good", "Excellent"], // Allowed values for the condition
    },
    //path set up for static file serving (default album cover image)
    image: { type: String, default: "/images/default-post.jpg" }, // Default image if none is provided
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

// Create the Album model based on the defined schema
const Album = mongoose.model("Album", albumSchema);

// Export the Album model for use in other parts of the application
export default Album;
