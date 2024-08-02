import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const uploadImages = async (req, res) => {
  const { path } = req.body;
  let files = Object.values(req.files).flat();
  let images = [];
  for (const file of files) {
    const url = await uploadToCloudinary(file, path);
    images.push(url);
    removeTemp(file.tempFilePath);
  }
  res.json(images);

  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listImages = async (req, res) => {
  const { path, sort, max } = req.body;
  cloudinary.v2.search
    .expression(`${path}`)
    .sort_by("created_at", `${sort}`)
    .max_results(`${max}`)
    .execute()
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      console.log(error.error.message);
    });
};

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (err, res) => {
        if (err) {
          removeTemp(file.tempFilePath);
          return res.status(400).json({ message: "Upload images failed." });
        }
        resolve({ url: res.secure_url });
      }
    );
  });
};

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export { uploadImages, listImages };
