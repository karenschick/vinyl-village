import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { requireAuth } from "../middleware";

const router = express.Router();

router
  .route("/:username")
  .get(async (req, res) => {
    const { username } = req.params;
    const populateQuery = {
      path: "posts",
      populate: { path: "author", select: ["username", "profile_image"] },
    };
    const user = await User.findOne({ username }).populate(populateQuery);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user.toJSON());
  })

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
    } = req.body;
    const { username } = req.params;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password || currentPassword || confirmPassword) {
      if (password.length < 8 || password.length > 20) {
        return res
          .status(422)
          .json({ error: "Password must be 8-20 characters long" });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({ error: "Passwords do not match" });
      }

      const passwordCorrect = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!passwordCorrect) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      user.passwordHash = await bcrypt.hash(password, 12);
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.city = city || user.city;
    user.state = state || user.state;

    try {
      await user.save();
      res.json(user.toJSON());
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//PUT /users/:username/avatar - update user avatar
router.put("/:username/avatar", requireAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { profile_image } = req.body;

    if (req.user.username.toLowerCase() !== username.toLowerCase()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profile_image = profile_image;

    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
