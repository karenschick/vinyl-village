import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    pattern: "[a-z0-9]+@[a-z]+.[a-z]{2,3}",
  },
  profile_image: { type: String, default: "/fox.svg" },
  posts: [
    {
      type: ObjectId,
      ref: "Post",
    },
  ],
  postLikes: [
    {
      type: ObjectId,
      ref: "Post",
    },
  ],
  albums:[{
    type: ObjectId,
    ref: "Album"
  }]
});

const User = mongoose.model("User", userSchema);

export default User;
