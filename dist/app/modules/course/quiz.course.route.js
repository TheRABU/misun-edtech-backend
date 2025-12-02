"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_course_controller_1 = require("./quiz.course.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const course_quiz_validation_1 = require("./course.quiz.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
const quizRoutes = (0, express_1.Router)();
//// /api/v1/courses/quiz
quizRoutes.post("/", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(course_quiz_validation_1.createQuizSchema), quiz_course_controller_1.QuizControllers.createQuiz);
quizRoutes.put("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(course_quiz_validation_1.updateQuizSchema), quiz_course_controller_1.QuizControllers.updateQuiz);
quizRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), quiz_course_controller_1.QuizControllers.deleteQuiz);
quizRoutes.get("/:quizId/attempts", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), quiz_course_controller_1.QuizControllers.getQuizAttempts);
/// user routes
quizRoutes.post("/attempt", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), quiz_course_controller_1.QuizControllers.attemptQuiz);
quizRoutes.get("/course/:courseId", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), quiz_course_controller_1.QuizControllers.getQuizzesByCourse);
quizRoutes.get("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), quiz_course_controller_1.QuizControllers.getQuizById);
quizRoutes.get("/my-attempts/all", (0, checkAuth_1.checkAuth)(user_types_1.Role.STUDENT), quiz_course_controller_1.QuizControllers.getMyAttempts);
exports.default = quizRoutes;
