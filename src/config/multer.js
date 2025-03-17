const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cafeShop", // Cloudinary folder
    format: ["png", "jpg", "jpeg"], // Convert all images to PNG
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
