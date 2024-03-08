const imageUpload = async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default imageUpload;
