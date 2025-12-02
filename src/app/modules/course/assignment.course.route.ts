import { Router } from "express";
import { AssignmentControllers } from "./assignment.course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "./course.assignment.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";

const assignmentRoutes = Router();

// admin routes
assignmentRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createAssignmentSchema),
  AssignmentControllers.createAssignment
);

assignmentRoutes.put(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateAssignmentSchema),
  AssignmentControllers.updateAssignment
);
assignmentRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  AssignmentControllers.deleteAssignment
);

// student routes

export default assignmentRoutes;
