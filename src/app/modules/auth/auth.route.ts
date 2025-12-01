import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", AuthControllers.credentialsLogin);
authRoutes.post("/logout", AuthControllers.logOut);

export default authRoutes;
