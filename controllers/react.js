import mongoose from "mongoose";
import React from "../models/react.js";
const reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body;

    const check = await React.findOne({
      postRef: postId,
      reactBy: new mongoose.Types.ObjectId(req.user.id),
    });

    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });
      await newReact.save();
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
      } else {
        await React.findByIdAndUpdate(check._id, { react: react });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReact = async (req, res) => {
  try {
    const rcs = await React.find({ postRef: req.params.id });
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    res.status(200).json({ react:rcs,check:check?.react });
    console.log('rcs',rcs);
    console.log('check',check);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { reactPost, getReact };
