import Joi from "joi";
import mongoose from "mongoose";
import { ProviderEnum, RoleEnum } from "../utils/constants.js";

const ImageSchema = new mongoose.Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },

    role: {
      type: String,
      enum: [RoleEnum.BUYER, RoleEnum.SELLER, RoleEnum.ADMIN],
      default: RoleEnum.BUYER,
    },
    avatar: {
      // This will now store the Profile Picture data
      secure_url: { type: String },
      public_id: { type: String },
    },

    coverPictures: {
      // ADD THIS FIELD for the cover image
      secure_url: { type: String },
      public_id: { type: String },
    },
    provider: {
      type: String,
      enum: [ProviderEnum.GOOGLE, ProviderEnum.FACEBOOK , ProviderEnum.SYSTEM],
      default: ProviderEnum.SYSTEM,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },

    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },

    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },

    // Added fields for OTP reset (if replacing resetToken with OTP initially)
    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
