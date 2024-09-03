import express from "express";
import cors from "cors";
import useRoutes from "./routes/user.js";
import imageRoutes from "./routes/upload.js";
import postRoutes from "./routes/post.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

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
