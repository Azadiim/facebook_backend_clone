import mongoose from "mongoose";
import React from "../models/react.js";
import User from "../models/User.js";
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
    //const check1 = rcs.find((x) => x.reactBy.toString() == req.user.id)?.react; ---> second method to find check
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const newReact = rcs.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const finalArray = [
      { react: "like", count: newReact.like ? newReact.like.length : 0 },
      { react: "love", count: newReact.love ? newReact.love.length : 0 },
      { react: "sad", count: newReact.sad ? newReact.sad.length : 0 },
      { react: "haha", count: newReact.haha ? newReact.haha.length : 0 },
      { react: "angry", count: newReact.angry ? newReact.angry.length : 0 },
      { react: "wow", count: newReact.wow ? newReact.wow.length : 0 },
    ];
    finalArray.sort((a, b) => {
      return b.count - a.count;
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.savedPosts.find((x) => x.post.toString() === req.params.id);

    res.status(200).json({
      react: finalArray,
      check: check?.react,
      total: rcs.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { reactPost, getReact };
