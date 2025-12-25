

import cloudinary from "../../../shared/config/cloudinary.config.js";

export const uploadPropertyImages = async (req, res, next) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({
        message: "Please upload at least one image",
      });
    }

    const images = [];

    for (const file of req.files) {
      const { secure_url } = await cloudinary.uploader.upload(file.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/properties`,
      });

      images.push(secure_url);
    }

    // attach images to request body
    req.body.images = images;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload property images",
      error: error.message,
    });
  }
};
