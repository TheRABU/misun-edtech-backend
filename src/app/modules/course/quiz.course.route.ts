import { Router } from "express";
import { QuizControllers } from "./quiz.course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createQuizSchema, updateQuizSchema } from "./course.quiz.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

const quizRoutes = Router();

quizRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createQuizSchema),
  QuizControllers.createQuiz
);

quizRoutes.put(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateQuizSchema),
  QuizControllers.updateQuiz
);

quizRoutes.delete("/:id", checkAuth(Role.ADMIN), QuizControllers.deleteQuiz);

quizRoutes.get(
  "/:quizId/attempts",
  checkAuth(Role.ADMIN),
  QuizControllers.getQuizAttempts
);

/// user routes

quizRoutes.post(
  "/attempt",
  checkAuth(Role.STUDENT),
  QuizControllers.attemptQuiz
);
quizRoutes.get(
  "/course/:courseId",
  checkAuth(Role.STUDENT),
  QuizControllers.getQuizzesByCourse
);
quizRoutes.get("/:id", checkAuth(Role.STUDENT), QuizControllers.getQuizById);
quizRoutes.get(
  "/my-attempts/all",
  checkAuth(Role.STUDENT),
  QuizControllers.getMyAttempts
);

export default quizRoutes;
