import express from "express";
import {
  getUserVisits,
  addVisit,
  updateVisitStatus,
  deleteVisit
} from "../controllers/Visits.controller.js";
import { authenticationMiddleware } from "../../../shared/middleware/authentication.middleware.js";

const router = express.Router();


router.use(authenticationMiddleware());

router.get("/", getUserVisits);


router.post("/", addVisit);


router.patch("/:visitId", updateVisitStatus);


router.delete("/:visitId", deleteVisit);

export default router;

