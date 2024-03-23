import express from "express";
import { createPost, getAllPosts } from "../controllers/post.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getAllPosts", userAuth, getAllPosts);

export default router;
