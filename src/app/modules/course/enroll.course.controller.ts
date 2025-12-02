import { NextFunction, Request, Response } from "express";
import { Course } from "./course.model";
import { Enrollment } from "./enroll.course.model";

const enrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { courseId, batchId } = req.body;

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cannot not found",
      });
    }

    const batchExists = course.batches.some(
      (batch) => batch.batchId === batchId
    );

    if (!batchExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID for this course",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
      batchId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course and batch",
      });
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      batchId,
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      data: enrollment,
    });
  } catch (error) {
    console.log("Cannot enroll now! Some error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Cannot enroll now! Some error occurred",
    });
  }
};

export const EnrollControllers = {
  enrollCourse,
};
