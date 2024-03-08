import express from "express";
import { uploadImages } from "../controllers/upload.js";
import imageUpload from "../middlewares/imageUpload.js";

const router = express.Router();

router.post("/uploadImages", imageUpload, uploadImages);

export default router;
