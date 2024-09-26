import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reactSchema = new mongoose.Schema({
  react: {
    type: String,
    enum: ["love", "sad", "haha", "wow", "angry", "like"],
    required: true,
  },
  postRef: {
    type: ObjectId,
    ref: "Post",
  },
  reactBy: {
    type: ObjectId,
    ref: "User",
  },
});

const React = mongoose.model("React", reactSchema);

export default React;
