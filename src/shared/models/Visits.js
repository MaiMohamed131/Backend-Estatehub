import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending","upcoming", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", VisitSchema);
