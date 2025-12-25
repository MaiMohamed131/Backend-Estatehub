import mongoose from "mongoose";

const FavoritePropertySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Property", 
    required: true 
  },
  dateAdded: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });


FavoritePropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model("FavoriteProperty", FavoritePropertySchema);












// import mongoose from "mongoose";

// const FavoritePropertySchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
//   dateAdded: { type: Date, default: Date.now }
// }, { timestamps: true });



// // const FavoritePropertySchema = new mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     propertyId: {
// //       type: Number,
// //       required: true,
// //     },

// //     image: {
// //       type: String,
// //       required: true,
// //     },

// //     title: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     location: {
// //       type: String,
// //       required: true,
// //     },

// //     price: {
// //       type: Number,
// //       required: true,
// //     },

// //     bedrooms: {
// //       type: Number,
// //       required: true,
// //     },

// //     bathrooms: {
// //       type: Number,
// //       required: true,
// //     },

// //     sqft: {
// //       type: Number,
// //       required: true,
// //     },

// //     type: {
// //       type: String,
// //       required: true,
// //     },

// //     featured: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     dateAdded: {
// //       type: Date,
// //       default: Date.now,
// //     },
// //   },
// //   { timestamps: true }
// // );

// export default mongoose.model(
//   "FavoriteProperty",
//   FavoritePropertySchema
// );
