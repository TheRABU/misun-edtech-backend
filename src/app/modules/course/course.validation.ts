import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  videoUrl: z.string().url("Invalid video URL"),
  duration: z.number().positive("Duration must be positive"),
  order: z.number().int().nonnegative("Order must be non-negative"),
});

const batchSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  maxStudents: z.number().positive().optional(),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructor: z.string().min(2, "Instructor name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  modules: z.array(moduleSchema).optional(),
  batches: z.array(batchSchema).min(1, "At least one batch is required"),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  instructor: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  modules: z.array(moduleSchema).optional(),
  batches: z.array(batchSchema).optional(),
});

export const courseQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(["price", "createdAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  tags: z.string().optional(),
});

export const enrollCourseSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  batchId: z.string().min(1, "Batch ID is required"),
});

export const markModuleCompleteSchema = z.object({
  enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid enrollment ID"),
  moduleId: z.string().min(1, "Module ID is required"),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
export type EnrollCourseInput = z.infer<typeof enrollCourseSchema>;
export type MarkModuleCompleteInput = z.infer<typeof markModuleCompleteSchema>;
