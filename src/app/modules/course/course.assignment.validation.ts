import { z } from "zod";

export const createAssignmentSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  moduleId: z.string().min(1, "Module ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().or(z.date()).optional(),
  maxScore: z.number().positive().optional(),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  dueDate: z.string().or(z.date()).optional(),
  maxScore: z.number().positive().optional(),
});

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid assignment ID"),
  submissionUrl: z.string().url("Invalid submission URL"),
  submissionText: z.string().optional(),
});

export const gradeAssignmentSchema = z.object({
  submissionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid submission ID"),
  score: z.number().min(0, "Score must be non-negative"),
  feedback: z.string().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
export type GradeAssignmentInput = z.infer<typeof gradeAssignmentSchema>;
