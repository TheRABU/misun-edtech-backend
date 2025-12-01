import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z
    .array(z.string())
    .min(2, "At least 2 options required")
    .max(6, "Maximum 6 options allowed"),
  correctAnswer: z
    .number()
    .int()
    .nonnegative("Correct answer must be a valid index"),
  points: z.number().positive().optional(),
});

export const createQuizSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  moduleId: z.string().min(1, "Module ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
  passingScore: z
    .number()
    .min(0)
    .max(100, "Passing score must be between 0 and 100"),
  duration: z.number().positive().optional(),
});

export const updateQuizSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  questions: z.array(questionSchema).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  duration: z.number().positive().optional(),
});

const answerSchema = z.object({
  questionIndex: z.number().int().nonnegative(),
  selectedAnswer: z.number().int().nonnegative(),
});

export const submitQuizSchema = z.object({
  quizId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid quiz ID"),
  answers: z.array(answerSchema).min(1, "At least one answer is required"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
