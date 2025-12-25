import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.Controller.js";

import  validate  from "../../../shared/middleware/validate.middleware.js"
import { createPropertySchema } from "../validators/property.validator.js"
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../../shared/middleware/authentication.middleware.js";
import { MulterHost } from "../../../shared/middleware/multer.middleware.js";
import { ImageExtensions } from "../../../shared/utils/constants.js";
import { uploadPropertyImages } from "../controllers/propertyUpload.controller.js";
const router = express.Router();

// CRUD Routes

// Only Admin & Agent should create properties
router.post("/",
  authenticationMiddleware(),
  authorizationMiddleware(["admin","seller"]),
  MulterHost(ImageExtensions).array("images", 10), // images field
  asyncHandler(uploadPropertyImages),
  validate(createPropertySchema),
  asyncHandler(createProperty)
);

// for admin and buyer
router.get("/",
  authenticationMiddleware(),
 authorizationMiddleware(["admin", "buyer","seller"]),
  asyncHandler(getAllProperties));
router.get("/:id", asyncHandler(getPropertyById));
// Only Admin & Agent update property
router.put("/:id",
  authenticationMiddleware(),
  authorizationMiddleware(["admin", "seller"]),
   MulterHost(ImageExtensions).array("images", 10), // images field
  asyncHandler(uploadPropertyImages),
  asyncHandler(updateProperty)
);

// Only Admin delete
router.delete("/:id",
  authenticationMiddleware(),
  authorizationMiddleware(["admin","seller"]),
  asyncHandler(deleteProperty)
);

export default router;
