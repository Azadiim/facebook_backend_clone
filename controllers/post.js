import { cloudchannel } from "googleapis/build/src/apis/cloudchannel/index.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
const createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: "Invalid Authentication" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userFollowings = await User.findById(req.user.id).select("following");
    const postOfFollowings = userFollowings.following.map((followingId) => {
      return Post.find({ user: followingId })
        .populate("user", "first_name last_name username picture cover")
        .populate(
          "comments.commentBy",
          "first_name last_name username picture cover"
        )
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPosts = await (await Promise.all(postOfFollowings)).flat();
    const myPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name username picture cover")
      .populate(
        "comments.commentBy",
        "first_name last_name username picture cover"
      )
      .sort({ createdAt: -1 })
      .limit(10);
    followingPosts.push(...[...myPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;

    const newComment = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("comments.commentBy", "picture first_name last_name username");

    res.json(newComment.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);

    const check = user?.savedPosts.find((x) => x.post.toString() === postId);

    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: { _id: check._id },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: { post: postId, savedAt: new Date() },
        },
      });
    }
    res.status(200).json(check);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndRemove(postId);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createPost, getAllPosts, comment, savePost, deletePost };
