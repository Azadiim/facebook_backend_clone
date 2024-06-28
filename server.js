import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import { readdirSync } from "fs";
import dotenv from "dotenv";

import  useRoutes from "./routes/user.js";
import imageRoutes from "./routes/upload.js";
import postRoutes  from "./routes/post.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
//routes
app.use("/", useRoutes);
app.use("/", imageRoutes);
app.use("/", postRoutes);

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
