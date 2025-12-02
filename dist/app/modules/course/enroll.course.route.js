"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enroll_course_controller_1 = require("./enroll.course.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const course_validation_1 = require("./course.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
/// http://localhost:5000/api/v1/courses/enroll
const enrollRoutes = (0, express_1.Router)();
enrollRoutes.post("/", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), (0, validateRequest_1.validateRequest)(course_validation_1.enrollCourseSchema), enroll_course_controller_1.EnrollControllers.enrollCourse);
enrollRoutes.get("/my-enrollments", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), enroll_course_controller_1.EnrollControllers.getMyEnrollments);
enrollRoutes.get("/:courseId", enroll_course_controller_1.EnrollControllers.getCourseEnrollments);
enrollRoutes.post("/complete-module", enroll_course_controller_1.EnrollControllers.markModuleComplete);
// progress
enrollRoutes.get("/:enrollmentId/progress", enroll_course_controller_1.EnrollControllers.getEnrollmentProgress);
enrollRoutes.delete("/:enrollmentId", enroll_course_controller_1.EnrollControllers.unenrollCourse);
exports.default = enrollRoutes;
