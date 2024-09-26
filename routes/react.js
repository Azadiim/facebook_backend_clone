import express from "express";
import { reactPost,getReact } from "../controllers/react.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.put("/reactPost",userAuth, reactPost);
router.get("/getReact/:id",userAuth, getReact);

export default router;
