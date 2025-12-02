"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignment_course_controller_1 = require("./assignment.course.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const course_assignment_validation_1 = require("./course.assignment.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
const assignmentRoutes = (0, express_1.Router)();
// admin routes
assignmentRoutes.post("/", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(course_assignment_validation_1.createAssignmentSchema), assignment_course_controller_1.AssignmentControllers.createAssignment);
assignmentRoutes.put("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(course_assignment_validation_1.updateAssignmentSchema), assignment_course_controller_1.AssignmentControllers.updateAssignment);
assignmentRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), assignment_course_controller_1.AssignmentControllers.deleteAssignment);
assignmentRoutes.get("/submissions", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), assignment_course_controller_1.AssignmentControllers.getAllSubmissions);
assignmentRoutes.post("/grade", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), assignment_course_controller_1.AssignmentControllers.gradeAssignment);
// student routes
assignmentRoutes.post("/submit", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), assignment_course_controller_1.AssignmentControllers.submitAssignment);
assignmentRoutes.get("/my-submissions/all", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), assignment_course_controller_1.AssignmentControllers.getMySubmissions);
exports.default = assignmentRoutes;
