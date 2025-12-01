import { NextFunction, Request, Response } from "express";
import { createCourseSchema } from "./course.validation";
import { Course } from "./course.model";

const addCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);

    const courseData = {
      ...validatedData,
      batches: validatedData.batches.map((batch) => ({
        ...batch,
        startDate: new Date(batch.startDate),
        endDate: batch.endDate ? new Date(batch.endDate) : undefined,
      })),
    };

    const course = await Course.create(courseData);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.log("Sorry could not add course right now", error);
    return res.status(500).json({
      success: false,
      message: "Sorry could not add course right now",
    });
  }
};

export const CourseControllers = {
  addCourse,
};
