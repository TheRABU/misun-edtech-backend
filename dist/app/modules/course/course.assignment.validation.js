"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeAssignmentSchema = exports.submitAssignmentSchema = exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const zod_1 = require("zod");
exports.createAssignmentSchema = zod_1.z.object({
    courseId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    moduleId: zod_1.z.string().min(1, "Module ID is required"),
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    dueDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    maxScore: zod_1.z.number().positive().optional(),
});
exports.updateAssignmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(10).optional(),
    dueDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    maxScore: zod_1.z.number().positive().optional(),
});
exports.submitAssignmentSchema = zod_1.z.object({
    assignmentId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid assignment ID"),
    submissionUrl: zod_1.z.string().url("Invalid submission URL"),
    submissionText: zod_1.z.string().optional(),
});
exports.gradeAssignmentSchema = zod_1.z.object({
    submissionId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid submission ID"),
    score: zod_1.z.number().min(0, "Score must be non-negative"),
    feedback: zod_1.z.string().optional(),
});
