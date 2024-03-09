import fs from "fs";
const imageUpload = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      res.status(400).json({ message: "No files were uploaded!" });
    }
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/gif" &&
        file.mimetype !== "image/webp"
      ) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ message: "Unsupported format!" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export default imageUpload;
