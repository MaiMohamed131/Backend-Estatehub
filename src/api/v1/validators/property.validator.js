import Joi from "joi";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "../../../shared/utils/constants.js";

export const createPropertySchema = Joi.object({
  title: Joi.string().max(200).required(),
  status: Joi.string().valid(...PROPERTY_STATUS).required(),
  type: Joi.string().valid(...PROPERTY_TYPES).required(),
  featured: Joi.boolean().optional(),
  address: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }).optional(),
  price: Joi.number().min(0).required(),
  priceNote: Joi.string().optional(),
  bedrooms: Joi.number().min(0).required(),
  bathrooms: Joi.number().min(0).required(),
  area: Joi.number().min(0).required(),
  builtYear: Joi.number().min(1800).max(new Date().getFullYear() + 1).required(),
  images:Joi.array().items(Joi.string().uri()).min(1).required(),
  description: Joi.string().max(2000).required(),
  features: Joi.array().items(
    Joi.object({
      name: Joi.string().required()
    })
  ).optional(),
});
