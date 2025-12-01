import { Router } from "express";
import { UserControllers } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", UserControllers.createUserWithEmailPassword);

export default userRoutes;
