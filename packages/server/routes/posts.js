import express from "express";
const router = express.Router();
import { Post } from "../models";
import { requireAuth } from "../middleware";
import { v4 as uuid } from 'uuid';
import path from 'path';


router.get("/", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
    "likes",
  ];
  const posts = await Post.find({})
    .sort({ created: -1 })
    .populate(populateQuery)
    .exec();

  res.json(posts.map((post) => post.toJSON()));
});

router.post("/", requireAuth, async (req, res, next) => {
  const { text } = req.body;
  const { user } = req;

  const post = new Post({
    text: text,
    author: user._id,
  });
  if (req.files && req.files.image) {
    const postImage = req.files.image;
    const imageName = uuid() + path.extname(postImage.name);
    const uploadPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      imageName
    );
    await postImage.mv(uploadPath);

    post.image = `/images/${imageName}`;
  }
  try {
    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate({ path: "author", select: ["username", "profile_image"] })
      .exec();
    user.posts = user.posts.concat(savedPost._id);

    await user.save();

    res.json(populatedPost.toJSON());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
  ];
  const post = await Post.findById(req.params.id)
    .populate(populateQuery)
    .exec();
  if (post) {
    res.json(post.toJSON());
  } else {
    res.status(404).end();
  }
});


router.delete("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) return res.sendStatus(404);
  res.json(deletedPost);
});

router.all("/like/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params;
  const { user } = req;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return res.status(422).json({ error: "Cannot find post" });
  }
  try {
    if (post.likes.includes(user.id)) {
      const result = await post.updateOne({
        $pull: { likes: user.id },
      });

      res.json(result);
    } else {
      const result = await post.updateOne({
        $push: { likes: user.id },
      });

      res.json(result);
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});



router.put('/comments/:commentId', requireAuth, async (req, res) => {
  const { commentId } = req.params;
  const {text} = req.body;

  try {
    // Find the post that contains the comment
    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) {
      return res.status(404).send('Post containing the comment not found');
    }

    // Update the specific comment in the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    comment.text = text;

    // Save the post with the updated comment
    await post.save();

    res.json(comment);
  } catch (error) {
    // Error handling
    res.status(500).send('Server error');
  }
});

router.delete("/comments/:commentId", requireAuth, async (req, res) => {
  const { commentId } = req.params;

  try {
    // Find the post that contains the comment
    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) {
      return res.status(404).send('Post containing the comment not found');
    }

    // Remove the comment from the post
    post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

    // Save the updated post
    await post.save();

    res.status(200).send('Comment deleted successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.put("/comments", async (req, res, next) => {
  const { text, userId, postId } = req.body;
  const comment = {
    text: text,
    author: userId,
  };
  const populateQuery = [
    { path: "comments.author", select: ["username", "profile_image"] },
  ];
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate(populateQuery)
    .exec((err, result) => {
      if (err) {
        next(err);
      } else {
        res.json(result);
      }
    });   
});


router.put("/:id", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedPost) {
      return res.sendStatus(404);
    }
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

module.exports = router;