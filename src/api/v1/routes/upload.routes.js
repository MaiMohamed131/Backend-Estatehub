

import { authenticationMiddleware } from '../../../shared/middleware/authentication.middleware.js';
import { MulterHost } from '../../../shared/middleware/multer.middleware.js';
import { ImageExtensions } from '../../../shared/utils/constants.js';
import * as uploadService from '../controllers/upload.controller.js'
import { Router } from "express";

const uploadroutes = Router();


uploadroutes.post("/upload",authenticationMiddleware(),MulterHost(ImageExtensions).single('profile'),uploadService.uploadCoverPictureCloud)
uploadroutes.post("/uploadMultiple",authenticationMiddleware(),MulterHost(ImageExtensions).array('profile'),uploadService.uploadCoverPictureCloudMultiple)

export default uploadroutes;
