import express from "express";
import { createPost, getAllPosts } from "../controllers/post.js";
import { authUser } from "../middlwares/auth.js";

const router = express.Router();

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", authUser, getAllPosts);

export default router;
