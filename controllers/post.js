import Post from "../models/Post.js";
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
    const posts = await Post.find()
      .populate("user", "first_name last_name gender picture username")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
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

export { createPost, getAllPosts, comment };
