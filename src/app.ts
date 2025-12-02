import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1", router);

// error handler for zod
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SERVER RUNNING FINE!",
  });
});

export default app;
