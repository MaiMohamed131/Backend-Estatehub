import mongoose from "mongoose";
import {
  PROPERTY_STATUS,
  PROPERTY_TYPES
} from "../utils/constants.js";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a property title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },

    status: {
      type: String,
      enum: {
        values: PROPERTY_STATUS,
        message: "Status must be either rent or sale",
      },
      required: [true, "Please specify property status"],
    },

    type: {
      type: String,
      enum: {
        values: PROPERTY_TYPES,
        message: "Please select a valid property type",
      },
      required: [true, "Please specify property type"],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      required: [true, "Please add an address"],
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },

    priceNote: {
      type: String,
      trim: true,
    },

    bedrooms: {
      type: Number,
      required: [true, "Please add number of bedrooms"],
      min: [0, "Bedrooms cannot be negative"],
    },

    bathrooms: {
      type: Number,
      required: [true, "Please add number of bathrooms"],
      min: [0, "Bathrooms cannot be negative"],
    },

    area: {
      type: Number,
      required: [true, "Please add property area in sqft"],
      min: [0, "Area cannot be negative"],
    },

    builtYear: {
      type: Number,
      required: [true, "Please add built year"],
      min: [1800, "Built year must be after 1800"],
      max: [
        new Date().getFullYear() + 1,
        "Built year cannot be in the future",
      ],
    },

    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },

    images: {
      type: [String],
      required: [true, "Please add at least one image"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Property must have at least one image",
      },
    },

    features: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign an agent to this property"],
      validate: {
        validator: async function (value) {
          const User = mongoose.model("User");
          const user = await User.findById(value);
          return user && user.role === "seller";
        },
        message: "The assigned agent must have role 'seller'",
      },
    },

  },
  { timestamps: true }
);

// const Property = mongoose.model("Property", PropertySchema);
// New way - checks if the model exists first
export const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);
export default Property;
