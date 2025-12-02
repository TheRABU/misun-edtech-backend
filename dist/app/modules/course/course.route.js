"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const course_validation_1 = require("./course.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
const courseRoutes = (0, express_1.Router)();
/// http://localhost:5000/api/v1/courses
courseRoutes.post("/add-course", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(course_validation_1.createCourseSchema), course_controller_1.CourseControllers.addCourse);
courseRoutes.put("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), course_controller_1.CourseControllers.updateCourse);
courseRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), course_controller_1.CourseControllers.deleteCourse);
courseRoutes.get("/:id", course_controller_1.CourseControllers.getCourse);
courseRoutes.get("/", course_controller_1.CourseControllers.getAllCourses);
exports.default = courseRoutes;
