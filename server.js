import express from "express";
import cors from "cors";
import useRoutes from "./routes/user.js";
import imageRoutes from "./routes/upload.js";
import postRoutes from "./routes/post.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use("/", useRoutes);
app.use("/", imageRoutes);
app.use("/", postRoutes);
const PORT = process.env.PORT || 8001;

// database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connection established successfully");
  })
  .catch((err) => {
    console.error("database connection failed", err);
  });

app.listen(PORT, () => {
  console.log(`Server in running on port ${PORT} ...`);
});
