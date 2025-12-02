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
assignmentRoutes.get(
  "/submissions",
  checkAuth(Role.ADMIN),
  AssignmentControllers.getAllSubmissions
);
assignmentRoutes.post(
  "/grade",
  checkAuth(Role.ADMIN),
  AssignmentControllers.gradeAssignment
);

// student routes
assignmentRoutes.post(
  "/submit",
  checkAuth(Role.STUDENT),
  AssignmentControllers.submitAssignment
);
assignmentRoutes.get(
  "/my-submissions/all",
  checkAuth(Role.STUDENT),
  AssignmentControllers.getMySubmissions
);
export default assignmentRoutes;
