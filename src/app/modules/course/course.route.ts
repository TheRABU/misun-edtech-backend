import { Router } from "express";
import { CourseControllers } from "./course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCourseSchema } from "./course.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

const courseRoutes = Router();

/// http://localhost:5000/api/v1/courses

courseRoutes.post(
  "/add-course",
  checkAuth(Role.ADMIN),
  validateRequest(createCourseSchema),
  CourseControllers.addCourse
);

courseRoutes.put("/:id", checkAuth(Role.ADMIN), CourseControllers.updateCourse);
courseRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  CourseControllers.deleteCourse
);

courseRoutes.get("/:id", CourseControllers.getCourse);

courseRoutes.get("/", CourseControllers.getAllCourses);

export default courseRoutes;
