import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authroutes from "./src/api/v1/routes/Auth.routes.js";
import { Database_connect } from "./src/shared/models/connection.js";
import uploadroutes from "./src/api/v1/routes/upload.routes.js";
import errorHandler from "./src/shared/middleware/error.middleware.js";
import { authenticationMiddleware } from "./src/shared/middleware/authentication.middleware.js";
import userRoutes from "./src/api/v1/routes/user.routes.js";
import apiRouter from "./src/api/v1/index.js";
// import paymentRoutes from "./src/api/v1/routes/payment.routes.js"
import favouritesRoutes from "./src/api/v1/routes/Favourites.routes.js"
import visitsRoutes from "./src/api/v1/routes/Visits.routes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const whitelist = [
  "http://localhost:4200",
  "http://localhost:5173",
  "http://localhost:3000",
  "null",
  "undefined"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow Postman, Insomnia, backend-to-backend requests
      return callback(null, true);
    }
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
};
app.use(errorHandler)

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authroutes);
app.use("/upload", uploadroutes);
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is healthy and running!",
    status: "OK",
    database: "Connected",
  });
});
// app.use('/api/payment', paymentRoutes);
app.use("/favorites", favouritesRoutes);
app.use("/visits", visitsRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is healthy and running!",
    status: "OK",
    database: "Connected",
  });
});
// Protected routes
// Note: The upload routes file already applies authentication middleware internally.
app.use("/api/users", authenticationMiddleware(), userRoutes);



async function startServer() {
  try {
    console.log("Attempting to connect to database...");
    await Database_connect();
    console.log("Database connection successful!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to an error:", error.message);
    process.exit(1);
  }
}
startServer();
