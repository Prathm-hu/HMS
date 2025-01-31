const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadMedia = async (file) => {
  try {
    const uploadResponce = await cloudinary.uploader.upload(file, {
      resource_type: "auto",    
    });
    return uploadResponce;
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMediaFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    console.log(error);
  }
};

exports.deleteVideoFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type: "video" });
    return true;
  } catch (error) {
    console.log(error);
  }
};


