import User from "./models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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

const deleteAll = async () => {
  try {
    await User.deleteMany();
    console.log("data destroyed successfully");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

deleteAll();
