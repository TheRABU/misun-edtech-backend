import { NextFunction, Request, Response } from "express";
import { Course } from "./course.model";
import { Assignment } from "./course.assignment.model";
import { Enrollment } from "./enroll.course.model";
import { AssignmentSubmission } from "./course.assignment.submission.model";

/// admin routes
const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId, moduleId } = req.body;

    const course = await Course.findOne({ _id: courseId, isDeleted: false });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const moduleExists = course.modules.some(
      (module) => module._id.toString() === moduleId
    );

    if (!moduleExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID for this course",
      });
    }

    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentsByCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { moduleId } = req.query;

    const query: any = { courseId, isDeleted: false };

    if (moduleId) {
      query.moduleId = moduleId;
    }

    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOne({ _id: id, isDeleted: false })
      .populate("courseId", "title")
      .lean();

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// admin routes ends here

// student related routes

const submitAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { assignmentId, submissionUrl, submissionText } = req.body;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      isDeleted: false,
    });

    if (!assignment) {
      res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
      return;
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId: assignment.courseId,
      isDeleted: false,
    });

    if (!enrollment) {
      res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
      return;
    }

    const existingSubmission = await AssignmentSubmission.findOne({
      assignmentId,
      userId,
      isDeleted: false,
    });

    if (existingSubmission) {
      existingSubmission.submissionUrl = submissionUrl;
      existingSubmission.submissionText = submissionText;
      existingSubmission.submittedAt = new Date();
      await existingSubmission.save();

      res.status(200).json({
        success: true,
        message: "Assignment resubmitted successfully",
        data: existingSubmission,
      });
      return;
    }

    const submission = await AssignmentSubmission.create({
      assignmentId,
      userId,
      submissionUrl,
      submissionText,
    });

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const AssignmentControllers = {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
};
