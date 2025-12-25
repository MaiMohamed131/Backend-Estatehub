import asyncHandler from "../../../shared/utils/asyncHandler.js";
import * as AuthService from "../controllers/Auth.controller.js";
import { Router } from "express";
import { authenticationMiddleware } from "../../../shared/middleware/authentication.middleware.js";

const authroutes = Router();

authroutes.get("/", (req, res) => {
 res.status(200).json({
 message: "Auth router is active.",
 });
});

authroutes.post("/signup", asyncHandler(AuthService.SignUp));
authroutes.get("/verify-email", asyncHandler(AuthService.VerifyEmailLink));
authroutes.post("/gmail-signup", asyncHandler(AuthService.GmailSignUp));  
authroutes.post("/gmail-signin", asyncHandler(AuthService.GmailSignIn));
authroutes.post("/signin", asyncHandler(AuthService.SignIn));
authroutes.post("/forgot-password", asyncHandler(AuthService.ForgotPassword));
authroutes.post("/verify-reset-otp", asyncHandler(AuthService.VerifyResetOTP));
authroutes.get("/verify-reset-token",asyncHandler(AuthService.VerifyResetToken));
authroutes.post("/reset-password", asyncHandler(AuthService.ResetPassword));
authroutes.post("/logout", asyncHandler(AuthService.Logout));

export default authroutes;