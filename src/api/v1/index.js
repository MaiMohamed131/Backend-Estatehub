import express from "express";
import propertyRoutes from "./routes/property.routes.js";

const router = express.Router();

router.use("/properties", propertyRoutes);
export default router;
