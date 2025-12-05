import { Router } from "express";
import { EnrollControllers } from "./enroll.course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { enrollCourseSchema } from "./course.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

/// http://localhost:5000/api/v1/courses/enroll

const enrollRoutes = Router();

enrollRoutes.post(
  "/",
  checkAuth(Role.STUDENT),
  validateRequest(enrollCourseSchema),
  EnrollControllers.enrollCourse
);

enrollRoutes.get(
  "/my-enrollments",
  checkAuth(Role.STUDENT),
  EnrollControllers.getMyEnrollments
);

// check enrollment
enrollRoutes.get(
  "/check/:courseId",
  checkAuth(Role.STUDENT),
  EnrollControllers.checkEnrollment
);

enrollRoutes.get("/:courseId", EnrollControllers.getCourseEnrollments);

enrollRoutes.post(
  "/complete-module",
  checkAuth(Role.STUDENT),
  EnrollControllers.markModuleComplete
);

// progress
enrollRoutes.get(
  "/progress/:enrollmentId",
  checkAuth(Role.STUDENT),
  EnrollControllers.getEnrollmentProgress
);

enrollRoutes.delete("/:enrollmentId", EnrollControllers.unenrollCourse);

export default enrollRoutes;
