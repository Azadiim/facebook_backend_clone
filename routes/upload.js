import express from "express";
import { uploadImages } from "../controllers/upload.js";

const router = express.Router();

router.post("/uploadImages", uploadImages);

export default router;
