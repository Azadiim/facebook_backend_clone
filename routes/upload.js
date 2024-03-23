import express from "express";
import { uploadImages } from "../controllers/upload.js";
import imageUpload from "../middlewares/imageUpload.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/uploadImages", userAuth, imageUpload, uploadImages);

export default router;
