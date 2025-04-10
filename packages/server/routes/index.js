import express from "express";
import authRouter from "./auth.js";
import userRouter from "./users.js";
import postRouter from "./posts.js";
import fileRouter from "./file.js";
//import fileUpload from "express-fileupload";
import albumRouter from "./albums.js"

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send("api endpoint");
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/files", fileRouter);
router.use("/albums", albumRouter);

export default router;