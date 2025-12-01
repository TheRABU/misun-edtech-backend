"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuizSchema = exports.updateQuizSchema = exports.createQuizSchema = void 0;
const zod_1 = require("zod");
const questionSchema = zod_1.z.object({
    question: zod_1.z.string().min(5, "Question must be at least 5 characters"),
    options: zod_1.z
        .array(zod_1.z.string())
        .min(2, "At least 2 options required")
        .max(6, "Maximum 6 options allowed"),
    correctAnswer: zod_1.z
        .number()
        .int()
        .nonnegative("Correct answer must be a valid index"),
    points: zod_1.z.number().positive().optional(),
});
exports.createQuizSchema = zod_1.z.object({
    courseId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    moduleId: zod_1.z.string().min(1, "Module ID is required"),
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    questions: zod_1.z
        .array(questionSchema)
        .min(1, "At least one question is required"),
    passingScore: zod_1.z
        .number()
        .min(0)
        .max(100, "Passing score must be between 0 and 100"),
    duration: zod_1.z.number().positive().optional(),
});
exports.updateQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().optional(),
    questions: zod_1.z.array(questionSchema).optional(),
    passingScore: zod_1.z.number().min(0).max(100).optional(),
    duration: zod_1.z.number().positive().optional(),
});
const answerSchema = zod_1.z.object({
    questionIndex: zod_1.z.number().int().nonnegative(),
    selectedAnswer: zod_1.z.number().int().nonnegative(),
});
exports.submitQuizSchema = zod_1.z.object({
    quizId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid quiz ID"),
    answers: zod_1.z.array(answerSchema).min(1, "At least one answer is required"),
});
