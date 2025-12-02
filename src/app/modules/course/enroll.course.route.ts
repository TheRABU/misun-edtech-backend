import { Router } from "express";
import { EnrollControllers } from "./enroll.course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { enrollCourseSchema } from "./course.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

const enrollRoutes = Router();

enrollRoutes.post(
  "/",
  checkAuth(Role.STUDENT),
  validateRequest(enrollCourseSchema),
  EnrollControllers.enrollCourse
);

export default enrollRoutes;
