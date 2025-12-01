import { Router } from "express";
import { CourseControllers } from "./course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCourseSchema } from "./course.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

const courseRoutes = Router();

courseRoutes.post(
  "/add-course",
  checkAuth(Role.ADMIN),
  validateRequest(createCourseSchema),
  CourseControllers.addCourse
);

export default courseRoutes;
