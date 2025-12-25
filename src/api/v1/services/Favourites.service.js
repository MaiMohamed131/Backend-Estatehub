import FavoriteProperty from "../../../shared/models/Favourites.js";
import Property from "../../../shared/models/Property.js";
import ApiError from "../../../shared/utils/ApiError.js";
import mongoose from "mongoose";

const addFavorite = async (userId, propertyId) => {
  if (!propertyId) {
    throw new ApiError(400, "propertyId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    throw new ApiError(400, "Invalid property ID format");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const exists = await FavoriteProperty.findOne({ userId, propertyId });
  if (exists) {
    throw new ApiError(400, "Property is already in favorites");
  }

  return await FavoriteProperty.create({
    userId,
    propertyId
  });
};

const removeFavorite = async (userId, propertyId) => {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    throw new ApiError(400, "Invalid property ID format");
  }

  const removed = await FavoriteProperty.findOneAndDelete({
    userId,
    propertyId: new mongoose.Types.ObjectId(propertyId)
  });

  if (!removed) {
    throw new ApiError(404, "Favorite not found");
  }

  return removed;
};

const getUserFavorites = async (userId) => {
  return await FavoriteProperty.find({ userId })
    .populate("propertyId")
    .sort({ createdAt: -1 });
};

export default {
  addFavorite,
  removeFavorite,
  getUserFavorites
};
