import asyncHandler from "../../../shared/utils/asyncHandler.js";
import favoritesService from "../services/Favourites.service.js";

export const addFavorite = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;
  const { propertyId } = req.body;

  const result = await favoritesService.addFavorite(userId, propertyId);

  res.status(201).json({
    success: true,
    message: "Added to favorites",
    data: result
  });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;
  const { propertyId } = req.params;

  const result = await favoritesService.removeFavorite(userId, propertyId);

  res.status(200).json({
    success: true,
    message: "Removed from favorites",
    data: result
  });
});

export const getUserFavorites = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;

  const result = await favoritesService.getUserFavorites(userId);

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});





// import FavoriteProperty from "../../../shared/models/Favourites.js";
// import asyncHandler from "../../../shared/utils/asyncHandler.js";
// import ApiError from "../../../shared/utils/ApiError.js";
// import Property from "../../../shared/models/Property.js";
// import mongoose from "mongoose";


// export const addFavorite = asyncHandler(async (req, res) => { 
//   console.log("✅ In add controller");
  
//   const userId = req.loggedInUser._id;
//   const { propertyId } = req.body; 
  
//   console.log("User ID:", userId);
//   console.log("Property ID:", propertyId);
  
//   if (!propertyId) {
//     throw new ApiError(400, "propertyId is required");
//   }
  
//   const exists = await FavoriteProperty.findOne({ userId, propertyId });
  
//   if (exists) {
//     throw new ApiError(400, "Property is already in favorites");
//   }
  
 
//   const favorite = await FavoriteProperty.create({
//     userId,
//     propertyId
//   });
  
//   res.status(201).json({ 
//     message: "Added to favorites", 
//     favorite 
//   });
// });


// export const removeFavorite = asyncHandler(async (req, res) => {
//   const userId = req.loggedInUser._id;
//   const { propertyId } = req.params;


//   if (!mongoose.Types.ObjectId.isValid(propertyId)) {
//     throw new ApiError(400, "Invalid property ID format");
//   }

//   const removed = await FavoriteProperty.findOneAndDelete({
//     userId,
//     propertyId: new mongoose.Types.ObjectId(propertyId)
//   });
  
//   if (!removed) {
//     throw new ApiError(404, "Favorite not found");
//   }

//   res.json({ 
//     message: "Removed from favorites", 
//     data: removed 
//   });
// });

// export const getUserFavorites = asyncHandler(async (req, res) => {
//   console.log("✅ In get favorites controller");
  
//   const userId = req.loggedInUser._id;
  
//   console.log("Getting favorites for user:", userId);
  
//   const favorites = await FavoriteProperty.find({ userId })
//     .populate('propertyId') 
//     .sort({ createdAt: -1 });
  
//   res.json({ 
//     count: favorites.length, 
//     data: favorites 
//   });
// });



