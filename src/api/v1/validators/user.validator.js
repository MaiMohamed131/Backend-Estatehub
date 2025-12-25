import Joi from "joi";

export const registerValidation = Joi.object({
  userName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 50 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    })
    .allow(""),

  location: Joi.string().trim().optional(),

  avatar: Joi.string().uri().optional(),

  role: Joi.string()
    .valid("buyer", "seller", "admin")
    .default("buyer")
    .optional(),
});

export const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const updateProfileValidation = Joi.object({
  userName: Joi.string().trim().min(2).max(50).optional(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    })
    .allow(""),

  location: Joi.string().trim().optional(),
});

export const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

export const otpValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
});
