import express from "express";
import { createPost } from "../controllers/post.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createPost", createPost);

export default router;
