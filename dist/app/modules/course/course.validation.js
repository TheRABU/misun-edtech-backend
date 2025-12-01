"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markModuleCompleteSchema = exports.enrollCourseSchema = exports.courseQuerySchema = exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const moduleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Module title is required"),
    description: zod_1.z.string().min(1, "Module description is required"),
    videoUrl: zod_1.z.string().url("Invalid video URL"),
    duration: zod_1.z.number().positive("Duration must be positive"),
    order: zod_1.z.number().int().nonnegative("Order must be non-negative"),
});
const batchSchema = zod_1.z.object({
    batchId: zod_1.z.string().min(1, "Batch ID is required"),
    startDate: zod_1.z.string().or(zod_1.z.date()),
    endDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    maxStudents: zod_1.z.number().positive().optional(),
});
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    instructor: zod_1.z.string().min(2, "Instructor name is required"),
    price: zod_1.z.number().nonnegative("Price must be non-negative"),
    category: zod_1.z.string().min(1, "Category is required"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    thumbnail: zod_1.z.string().url().optional(),
    modules: zod_1.z.array(moduleSchema).optional(),
    batches: zod_1.z.array(batchSchema).min(1, "At least one batch is required"),
});
exports.updateCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(10).optional(),
    instructor: zod_1.z.string().min(2).optional(),
    price: zod_1.z.number().nonnegative().optional(),
    category: zod_1.z.string().min(1).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    thumbnail: zod_1.z.string().url().optional(),
    modules: zod_1.z.array(moduleSchema).optional(),
    batches: zod_1.z.array(batchSchema).optional(),
});
exports.courseQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().optional(),
    maxPrice: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["price", "createdAt", "title"]).optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    tags: zod_1.z.string().optional(),
});
exports.enrollCourseSchema = zod_1.z.object({
    courseId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    batchId: zod_1.z.string().min(1, "Batch ID is required"),
});
exports.markModuleCompleteSchema = zod_1.z.object({
    enrollmentId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid enrollment ID"),
    moduleId: zod_1.z.string().min(1, "Module ID is required"),
});
