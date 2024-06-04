import express from "express";
import { uploadImages, listImages } from "../controllers/upload.js";
import imageUpload from "../middlewares/imageUpload.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/uploadImages", userAuth, imageUpload, uploadImages);
router.post("/listImages",userAuth, listImages);

export default router;
