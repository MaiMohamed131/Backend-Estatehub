import {
  registerUserService,
  signInService,
  verifyEmailLinkService,
  verifyOtpService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
  verifyResetOTPandGenerateTokenService,
  gmailRegistrationService,
  gmailLoginService,
  verifyResetTokenService,
} from "../services/Auth.service.js";

export const SignUp = async (req, res) => {
  const { email, password, confirmPassword, userName, phone , role } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "password and confirm password do not match" });
  }

  // Call the updated service
  const { user, accessToken, refreshToken } = await registerUserService({
    email,
    password,
    userName,
    phone,
    role,
  });

  return res.status(201).json({
    // Updated message to reflect link verification
    message:
      "User created successfully. A verification link has been sent to your email.",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      isVerified: user.isVerified, // Should be false
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};

export const VerifyEmailLink = async (req, res) => {
  const { token: verificationToken } = req.query;
  console.log("verificationTokennnnnnnnnnnnn: ", verificationToken);

  try {
    const { updatedUser, accessToken, refreshToken } =
      await verifyEmailLinkService({
        verificationToken,
      });
    console.log("verificationToken: ", verificationToken); // Redundant line
    console.log(updatedUser , accessToken , refreshToken);
      
    return res.status(200).json({
  message: "Account verified successfully. Welcome!",
  user: {
    id: updatedUser._id,
    userName: updatedUser.userName,
    email: updatedUser.email,
    isVerified: updatedUser.isVerified,
    role: updatedUser.role,
  },
  accessToken,   
  refreshToken,
});
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to verify email link.",
    });
  }
};

export const VerifyOTP = async (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res
      .status(400)
      .json({ message: "Email and OTP code are required." });
  }
  const { resetToken  } = await verifyOtpService({
    email,
    otpCode,
  });

  return res.status(200).json({
    message: "Account verified successfully. Welcome!",
    resetToken
  });
};

export const SignIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const { user, accessToken, refreshToken } = await signInService({
    email,
    password,
  });
  return res.status(200).json({
    message: "Login successful.",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      isVerified: user.isVerified,
      role:user.role
    },
    accessToken,
    refreshToken,
  });
};

export const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to reset password." });
  }

  try {
    await forgotPasswordService({ email });
    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset code has been sent.",
    });
  } catch (error) {
    if (error.status === 200) {
      return res.status(200).json({ message: error.message });
    }
    return res.status(error.status || 500).json({
      message: error.message || "Failed to send password reset code.",
    });
  }
};

// Add this export function alongside your other controller functions
export const VerifyResetToken = async (req, res) => {
    const { token } = req.query; // Assuming the token is passed as a query parameter

    if (!token) {
        return res.status(400).json({ message: "Token is required for verification." });
    }

    try {
        await verifyResetTokenService({ resetToken: token }); 

        return res.status(200).json({
            message: "Token is valid. Proceed to reset password.",
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || "Failed to verify reset token.",
        });
    }
};

export const VerifyResetOTP = async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email);
  console.log(otpCode);
  
  if (!email || !otpCode) {
    return res
      .status(400)
      .json({ message: "Email and OTP code are required." });
  }

  try {
    const { resetToken } = await verifyResetOTPandGenerateTokenService({
      email,
      otpCode,
    });

    return res.status(200).json({
      message: "Verification successful. Use the token to reset your password.",
      resetToken: resetToken, // Send the temporary JWT reset token back
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to verify reset OTP.",
    });
  }
};

export const ResetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (!token || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      message: "Token and password fields are required.",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirmation password do not match" });
  }

  try {
    const { updatedUser, accessToken, refreshToken } =
      await resetPasswordService({
        resetToken: token,
        newPassword,
      });

    return res.status(200).json({
      message: "Password reset successful. go to login",
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to reset password.",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const accessToken = req.headers.accesstoken;
    const refreshToken = req.body.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        message:
          "Access Token (in accesstoken header) and Refresh Token (in body) are required for secure logout.",
      });
    }

    await logoutService({ accessToken, refreshToken });

    return res.status(200).json({
      message: "Logout successful. All sessions terminated.",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to logout.",
    });
  }
};

export const GmailSignUp = async (req, res) => {
    const { credential } = req.body;
    
    if (!credential) {
        return res.status(400).json({ message: "Credential missing" });
    }

    try {
        const { user, accessToken, refreshToken } = await gmailRegistrationService({
            credential,
        });

        return res.status(201).json({
            message: "User registered successfully via Google.",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                isVerified: user.isVerified,
                role:user.role 
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        if (error.data && error.data.shouldLogin) {
             return res.status(409).json({ message: error.message, action: 'login' });
        }
        return res.status(error.status || 401).json({
            message: "Google Registration Failed: " + (error.message || "Invalid token."),
        });
    }
};

export const GmailSignIn = async (req, res) => {
    const { credential } = req.body;
    
    if (!credential) {
        return res.status(400).json({ message: "Credential missing" });
    }

    try {
        const { user, accessToken, refreshToken } = await gmailLoginService({
            credential,
        });

        return res.status(200).json({
            message: "Sign in successful via Google.",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                isVerified: user.isVerified,
                role:user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        if (error.data && error.data.shouldRegister) {
             return res.status(404).json({ message: error.message, action: 'register' });
        }
        return res.status(error.status || 401).json({
            message: "Google Sign In Failed: " + (error.message || "Invalid token."),
        });
    }
};