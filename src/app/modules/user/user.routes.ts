import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.types";

const userRoutes = Router();

userRoutes.post("/register", UserControllers.createUserWithEmailPassword);
userRoutes.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

// check if user is admin
userRoutes.get(
  "/is-admin",
  checkAuth(...Object.values(Role)),
  UserControllers.isAdmin
);

export default userRoutes;
