import User from "../../../shared/models/User.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/tokens.js";
import { Encryption } from "../../../shared/utils/encryption.js";
import { generateOTP } from "../../../shared/utils/otp.js";
import {
  otpVerificationEmailTemplate,
  verifyLinkEmailTemplate,
} from "../../../shared/utils/emailTemplate.js";
import jwt from "jsonwebtoken";
import { emitter } from "./email.service.js";
import blackListTokens from "../../../shared/models/BlackListToken.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../../shared/utils/constants.js";
import { hashSync } from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; // <-- ADD THIS LINE


export const registerUserService = async ({
  email,
  password,
  userName,
  phone,
  role
}) => {
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    throw new ApiError(409, "Email already exists");
  }

  const encryptedPhone = await Encryption({
    value: phone,
    secretKey: "encryptPhoneKey",
  });

  const hashPassword = await bcrypt.hash(password, +process.env.SALT); // Use hash for async operation

  const verificationToken = jwt.sign(
    { email: email },
    process.env.EMAIL_VERIFICATION_SECRET, // Use a dedicated secret
    { expiresIn: "24h" }
  );

  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

  const user = await User.create({
    email: email,
    password: hashPassword,
    userName,
    phone: encryptedPhone,
    verificationToken: verificationToken,
    verificationTokenExpiry: verificationTokenExpiry,
    isVerified: false,
    role,
  });
  if (!user) {
    throw new Error("Failed to create user record in the database.");
  }

  const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  const emailHTML = verifyLinkEmailTemplate(userName, verificationToken);
  console.log(verificationToken);
  console.log(process.env.EMAIL_VERIFICATION_SECRET);

  emitter.emit("SendEmail", {
    to: email,
    subject: "Verify Your Email Address",
    html: emailHTML,
  });

  return { user, accessToken, refreshToken };
};

export const verifyEmailLinkService = async ({ verificationToken }) => {
  if (!verificationToken) {
    throw new ApiError(400, "Verification token is missing.");
  }
  console.log("herree veriii");

  let decoded;
  try {
    decoded = jwt.verify(
      verificationToken,
      process.env.EMAIL_VERIFICATION_SECRET
    );
    console.log("emailll: ", decoded.email);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired verification link.");
  }

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    throw new ApiError(404, "User not found or already verified.");
  }

  if (
    user.verificationToken !== verificationToken ||
    user.verificationTokenExpiry < new Date()
  ) {
    throw new ApiError(401, "Verification link has expired or is invalid.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  const updatedUser = await user.save();

  const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(user.email);
  return { updatedUser, accessToken, refreshToken };
};

// export const verifyOtpService = async ({ email, otpCode }) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     const error = new Error("User not found.");
//     error.status = 404;
//     throw error;
//   }
//   if (user.otp !== otpCode) {
//     const error = new Error("Invalid verification code.");
//     error.status = 401;
//     throw error;
//   }
//   if (user.otpExpiry < new Date()) {
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     const error = new Error(
//       "Verification code has expired. Please request a new one."
//     );
//     error.status = 401;
//     throw error;
//   }
//   user.isVerified = true;
//   user.otp = undefined;
//   user.otpExpiry = undefined;
//   const updatedUser = await user.save();

//   const accessToken = generateAccessToken(user.email);
//   const refreshToken = generateRefreshToken(user.email);
//   return { updatedUser, accessToken, refreshToken };
// };

export const verifyOtpService = async ({ email, otpCode }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  if (user.resetOtp !== otpCode) {
    const error = new Error("Invalid verification code.");
    error.status = 401;
    throw error;
  }

  if (user.resetOtpExpiry < new Date()) {
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    const error = new Error("OTP expired. Please request a new one.");
    error.status = 401;
    throw error;
  }

  // generate reset token
  const resetToken = generateResetPasswordToken(user._id);

  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  return { resetToken };
};

export const signInService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  console.log(user);
  
  if (!user) {
    throw new ApiError(401, "this email not registered");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  if (user.isVerified === false) {
    throw new ApiError(
      403,
      "Account not verified. Please verify your email using the OTP."
    );
  }

  const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  return { user, accessToken, refreshToken };
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return new ApiError(
      200,
      "If an account with that email exists, a password reset code has been sent."
    );
  }

  const otpCode = generateOTP(6);
  const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000);

  user.resetOtp = otpCode;
  user.resetOtpExpiry = otpExpiryTime;
  await user.save();

  const emailHTML = otpVerificationEmailTemplate(user.userName, otpCode);

  emitter.emit("SendEmail", {
    to: email,
    subject: "Password Reset Verification Code",
    html: emailHTML,
  });

  return { message: "Password reset OTP sent to your email." };
};

export const verifyResetOTPandGenerateTokenService = async ({
  email,
  otpCode,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return new ApiError(404, "User not found");
  }

  if (!user.resetOtp) {
    return new ApiError(400, "No pending reset request found.");
  }

  if (user.resetOtp !== otpCode) {
    return new ApiError(401, "Invalid verification code.");
  }

  if (user.resetOtpExpiry < new Date()) {
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    return new ApiError(
      401,
      "Verification code has expired. Please request a new one."
    );
  }
  const resetToken = jwt.sign(
    { email: email, purpose: "password_reset" },
    process.env.EMAIL_VERIFICATION_SECRET,
    { expiresIn: "10m" }
  );

  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  return { resetToken };
};

export const resetPasswordService = async ({ resetToken, newPassword }) => {
  const { user } = await verifyResetTokenService({ resetToken });

  const hashPassword = await bcrypt.hash(newPassword, +process.env.SALT);

  user.password = hashPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  const updatedUser = await user.save();

  const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  return { updatedUser, accessToken, refreshToken };
};

export const verifyResetTokenService = async ({ resetToken }) => {
  if (!resetToken) {
    const error = new Error("Reset token is missing.");
    error.status = 400;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.EMAIL_VERIFICATION_SECRET);
  } catch (err) {
    const error = new Error(
      "Invalid or expired reset token. Please restart the forgot password process."
    );
    error.status = 401;
    throw error;
  }

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  if (user.resetToken !== resetToken || user.resetTokenExpiry < new Date()) {
    const error = new Error(
      "Reset token has been used, is expired, or is invalid."
    );
    error.status = 401;
    throw error;
  }

  return { user };
};

export const logoutService = async ({ accessToken, refreshToken }) => {
  const decodedAccess = jwt.decode(accessToken);
  const decodedRefresh = jwt.decode(refreshToken);

  if (!decodedAccess || !decodedRefresh) {
    const error = new Error("Invalid token format for blacklisting.");
    error.status = 400;
    throw error;
  }

  const accessExpiryDate = new Date(decodedAccess.exp * 1000);
  const refreshExpiryDate = new Date(decodedRefresh.exp * 1000);

  await blackListTokens.create({
    tokenId: decodedAccess.jti,
    expiryDate: accessExpiryDate,
  });

  await blackListTokens.create({
    tokenId: decodedRefresh.jti,
    expiryDate: refreshExpiryDate,
  });

  return { message: "Logout successful." };
};


export const gmailRegistrationService = async ({ credential }) => {
    // 1. Verify Google Token
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email_verified, email, name } = payload;
    
    if (!email_verified) {
        throw new ApiError(400, "Email not verified by Google");
    }

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
        if (isEmailExists.provider !== ProviderEnum.GOOGLE) {
            throw new ApiError(400, "Email already exists (signed up via password). Please sign in.");
        }
        throw new ApiError(409, "User already registered via Google. Please use the Google sign-in route.", { shouldLogin: true });
    }

    const user = new User({
        userName: name,
        email,
        provider: ProviderEnum.GOOGLE,
        isVerified: true,
        password: bcrypt.hashSync(uuidv4(), +process.env.SALT_ROUNDS || 10), 
    });
    await user.save();
    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    return { user, accessToken, refreshToken };
};


export const gmailLoginService = async ({ credential }) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    
    const { email_verified, email } = payload;
    console.log(email_verified, email);
    
    if (!email_verified) {
        throw new ApiError(400, "Email not verified by Google");
    }
    const user = await User.findOne({ email, provider: ProviderEnum.GOOGLE });
    
    if (!user) {
        throw new ApiError(404, "User not found. Please register via Google.", { shouldRegister: true });
    }
    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    return { user, accessToken, refreshToken };
};