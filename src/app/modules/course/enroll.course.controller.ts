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

const getMyEnrollments = async (
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

    const enrollments = await Enrollment.find({ userId })
      .populate(
        "courseId",
        "title description instructor thumbnail price category"
      )
      .sort({ enrolledAt: -1 })
      .lean();

    if (!enrollments) {
      return res.status(404).json({
        success: false,
        message: "No enrollment found!",
      });
    }

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    const query: any = { courseId, isDeleted: false };

    if (batchId) {
      query.batchId = batchId;
    }

    const enrollments = await Enrollment.find(query)
      .populate("userId", "name email")
      .sort({ enrolledAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        total: enrollments.length,
        enrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};

const markModuleComplete = async (
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

    const { enrollmentId, moduleId } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId,
      isDeleted: false,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.completedModules.includes(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Module already marked as completed",
      });
    }

    const course = await Course.findById(enrollment.courseId);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
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

    enrollment.completedModules.push(moduleId);

    const totalModules = course.modules.length;
    const completedCount = enrollment.completedModules.length;
    enrollment.progress =
      totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Module marked as completed",
      data: {
        progress: enrollment.progress,
        completedModules: enrollment.completedModules,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEnrollmentProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { enrollmentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId,
      isDeleted: false,
    })
      .populate("courseId", "title modules")
      .lean();

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

const unenrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { enrollmentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: enrollmentId, userId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!enrollment) {
      res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Successfully unenrolled from the course",
    });
  } catch (error) {
    next(error);
  }
};

const checkEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      isDeleted: false,
    });
    if (enrollment) {
      return res.status(200).json({
        success: true,
        enrolled: true,
        enrollmentId: enrollment._id,
      });
    } else {
      return res.status(200).json({
        success: true,
        enrolled: false,
      });
    }
  } catch (error) {
    console.log("Cannot check enrollment now! Some error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Cannot check enrollment now! Some error occurred",
    });
  }
};

export const EnrollControllers = {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollments,
  getEnrollmentProgress,
  markModuleComplete,
  unenrollCourse,
  checkEnrollment,
};
