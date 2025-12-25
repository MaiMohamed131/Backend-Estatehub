import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", userController.getUserProfile);

router.put("/profile", userController.updateUserProfile);

router.post("/avatar", userController.uploadAvatar); // This seems to be handled by upload.routes.js now, consider removing if duplicate

router.get("/", userController.getAllUsers);

router.delete("/:id", userController.deleteUser);

export default router;
