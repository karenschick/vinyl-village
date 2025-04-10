import express from "express"; // Importing Express framework
import { Post } from "../models/index.js"; // Importing the Post model
import requireAuth from "../middleware/requireAuth.js"; // Importing authentication middleware
import { v4 as uuid } from "uuid"; // Importing UUID generator for unique image filenames
import path from "path"; // Importing path module for file path manipulation

const router = express.Router(); // Creating a new router instance

// GET route to retrieve all posts, sorted by creation date
router.get("/", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] }, // Populating author details
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] }, // Populating comment author details
    },
    "likes", // Including likes in the populated response
  ];
  const posts = await Post.find({}) // Fetching all posts
    .sort({ created: -1 }) // Sorting by creation date in descending order
    .populate(populateQuery) // Populating the defined fields
    .exec(); // Executing the query

  res.json(posts.map((post) => post.toJSON())); // Sending the posts as JSON
});

// POST route to create a new post, requiring authentication
router.post("/", requireAuth, async (req, res, next) => {
  const { text, imageBase64 } = req.body; // Extracting text and imageBese64 from request body
  const { user } = req; // Getting the authenticated user

  const post = new Post({
    // Creating a new Post instance
    text: text,
    author: user._id,
  });

  //Check if imageBase64 is provided in request
  if(imageBase64){
    post.image = imageBase64;
  }
  
  // Handling image upload if provided
  if (req.files && req.files.image) {
    const postImage = req.files.image; // Extracting the image file
    const imageName = uuid() + path.extname(postImage.name); // Generating a unique filename
    const uploadPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      imageName
    );
    await postImage.mv(uploadPath); // Moving the uploaded image to the specified path

    post.image = `/images/${imageName}`; // Storing the image path in the post
  }

  try {
    const savedPost = await post.save(); // Saving the post to the database
    const populatedPost = await Post.findById(savedPost._id)
      .populate({ path: "author", select: ["username", "profile_image"] })
      .exec();
    user.posts = user.posts.concat(savedPost._id); // Adding the post ID to the user's posts
    await user.save(); // Saving the updated user
    res.json(populatedPost.toJSON()); // Sending the populated post as JSON
  } catch (error) {
    next(error); // Passing any errors to the error handling middleware
  }
});

// GET route to retrieve a single post by ID
router.get("/:id", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
  ];
  const post = await Post.findById(req.params.id) // Finding the post by ID
    .populate(populateQuery) // Populating the defined fields
    .exec();
  if (post) {
    res.json(post.toJSON()); // Sending the post as JSON if found
  } else {
    res.status(404).end(); // Sending a 404 status if not found
  }
});

// DELETE route to remove a post by ID, requiring authentication
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params; // Extracting the post ID from the request parameters
  const deletedPost = await Post.findByIdAndDelete(id); // Deleting the post by ID
  if (!deletedPost) return res.sendStatus(404); //Sending 404 if post not found
  res.json(deletedPost); // Sending the deleted post as JSON
});

// POST route to like or unlike a post, requiring authentication
router.post("/like/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params; // Extracting post ID from parameters
  const { user } = req; // Getting the authenticated user

  try {
    const post = await Post.findById(postId); // Finding the post by ID

    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // Sending 404 if post not found
    }

    // Checking if the user has already liked the post
    const isLiked = post.likes.some((like) => like.equals(user._id));

    if (isLiked) {
      post.likes.pull(user._id); // Removing the user ID from likes if already liked
    } else {
      post.likes.push(user._id); // Adding the user ID to likes if not already liked
    }

    await post.save(); // Saving the updated post

    res.json({ likes: post.likes }); // Sending the updated likes as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" }); // Sending a 500 status on error
  }
});

// PUT route to update a comment by its ID, requiring authentication
router.put("/comments/:commentId", requireAuth, async (req, res) => {
  const { commentId } = req.params; // Extracting comment ID from parameters
  const { text } = req.body; // Extracting the updated text from request body

  try {
    const post = await Post.findOne({ "comments._id": commentId }); // Finding the post containing the comment
    if (!post) {
      return res.status(404).send("Post containing the comment not found"); // Sending 404 if post not found
    }

    const comment = post.comments.id(commentId); // Finding the specific comment by ID
    if (!comment) {
      return res.status(404).send("Comment not found"); // Sending 404 if comment not found
    }
    comment.text = text; // Updating the comment text
    await post.save(); // Saving the updated post
    res.json(comment); // Sending the updated comment as JSON
  } catch (error) {
    res.status(500).send("Server error"); // Sending a 500 status on error
  }
});

// DELETE route to remove a comment by its ID, requiring authentication
router.delete("/comments/:commentId", requireAuth, async (req, res) => {
  const { commentId } = req.params; // Extracting comment ID from parameters

  try {
    const post = await Post.findOne({ "comments._id": commentId }); // Finding the post containing the comment
    if (!post) {
      return res.status(404).send("Post containing the comment not found"); // Sending 404 if post not found
    }

    // Filtering out the comment from the post's comments array
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save(); // Saving the updated post

    res.status(200).send("Comment deleted successfully"); // Sending success response
  } catch (error) {
    res.status(500).send("Server error"); // Sending a 500 status on error
  }
});

// PUT route to add a new comment to a post
router.put("/comments", async (req, res, next) => {
  const { text, userId, postId } = req.body; // Extracting comment data from request body
  const comment = {
    text: text,
    author: userId,
  };
  const populateQuery = [
    { path: "comments.author", select: ["username", "profile_image"] },
  ];
  // Adding the new comment to the post's comments array
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate(populateQuery) // Populating the author details of comments
    .exec((err, result) => {
      if (err) {
        next(err); // Passing errors to the error handling middleware
      } else {
        res.json(result); // Sending the updated post as JSON
      }
    });
});

// PUT route to update a post by ID, requiring authentication
router.put("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params; // Extracting post ID from parameters
  const updatedData = req.body; // Extracting updated data from request body

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });
    if (!updatedPost) {
      return res.sendStatus(404); // Sending 404 if post not found
    }
    res.json(updatedPost); // Sending the updated post as JSON
  } catch (error) {
    next(error); // Passing any errors to the error handling middleware
  }
});

// Exporting the router for use in other parts of the application
export default router;
;
