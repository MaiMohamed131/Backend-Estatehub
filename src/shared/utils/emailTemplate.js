// const welcomeEmailTemplate = (userName) => {
//   return `
//     <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>Welcome to Our App!</h2>
//         <p>Hi ${userName || "there"},</p>
//         <p>Thank you for signing up! We're excited to have you on board.</p>
//         <p>Best regards,<br>The Team</p>
//     </div>
//   `;
// };

// const resetPasswordEmailTemplate = (userName, token) => {
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

//   return `
//     <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>Reset Password</h2>
//         <p>Hi ${userName || "there"},</p>
//         <p>You have requested to reset your password. Please click the link below to reset your password:</p>
//         <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
//         <p style="color: #666; font-size: 14px;">Or copy this link: ${resetUrl}</p>
//         <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
//         <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
//         <p>Best regards,<br>The Team</p>
//     </div>
//   `;
// };

// module.exports = { welcomeEmailTemplate, resetPasswordEmailTemplate };

export const welcomeEmailTemplate = (userName) => {
  return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Our App!</h2>
            <p>Hi ${userName || "there"},</p>
            <p>Thank you for signing up! We're excited to have you on board.</p>
            <p>Best regards,<br>The Team</p>
        </div>
    `;
};

export const otpVerificationEmailTemplate = (userName, otp) => {
  return `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #4F46E5;">Email Verification Code</h2>
            <p>Hi ${userName || "there"},</p>
            <p>Use the code below to complete your email verification. This code is valid for 10 minutes.</p>
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 32px; font-weight: bold; margin: 0; color: #1F2937;">${otp}</p>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>The Team</p>
        </div>
    `;
};

export const resetPasswordEmailTemplate = (userName, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Password</h2>
            <p>Hi ${userName || "there"},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p style="color: #666; font-size: 14px;">Or copy this link: ${resetUrl}</p>
            <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The Team</p>
        </div>
    `;
};

export const verifyLinkEmailTemplate = (userName, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Our App! Confirm Your Email</h2>
            <p>Hi ${userName || "there"},</p>
            <p>Thank you for signing up! Please click the button below to verify your email address and activate your account:</p>
            <p><a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px;">Verify Email Address</a></p>
            <p style="color: #666; font-size: 14px;">Or copy this link: ${verificationUrl}</p>
            <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Team</p>
        </div>
    `;
};

export const resetPasswordLinkEmailTemplate = (userName, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>Hi ${userName || "there"},</p>
            <p>You have requested to reset your password. Please click the button below to set a new password:</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p style="color: #666; font-size: 14px;">Or copy this link: ${resetUrl}</p>
            <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The Team</p>
        </div>
    `;
};
