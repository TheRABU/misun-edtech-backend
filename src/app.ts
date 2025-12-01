import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SERVER RUNNING FINE!",
  });
});

export default app;
