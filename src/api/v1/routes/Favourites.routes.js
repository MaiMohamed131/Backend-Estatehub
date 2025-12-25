import express from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../controllers/Favourites.controller.js";
import { authenticationMiddleware } from "../../../shared/middleware/authentication.middleware.js";

const router = express.Router();


router.use(authenticationMiddleware());


router.post("/add", addFavorite);


router.delete("/:propertyId", removeFavorite);


router.get("/", getUserFavorites);

export default router;
