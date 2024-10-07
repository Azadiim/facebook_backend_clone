import express from "express";
import { createPost, getAllPosts,comment } from "../controllers/post.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getAllPosts", userAuth, getAllPosts);
router.put("/comment", userAuth, comment);

export default router;
