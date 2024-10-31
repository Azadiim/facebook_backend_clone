import express from "express";
import {
  createPost,
  getAllPosts,
  comment,
  savePost,
  deletePost
} from "../controllers/post.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getAllPosts", userAuth, getAllPosts);
router.put("/comment", userAuth, comment);
router.put("/savePost/:id", userAuth, savePost);
router.delete("/deletePost/:id", userAuth, deletePost);

export default router;
