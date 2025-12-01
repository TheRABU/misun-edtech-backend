import { NextFunction, Request, Response } from "express";
import {
  courseQuerySchema,
  createCourseSchema,
  updateCourseSchema,
} from "./course.validation";
import { Course } from "./course.model";
import mongoose from "mongoose";

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

const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }
    const course = await Course.findOne({ _id: id, isDeleted: false });

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedQuery = courseQuerySchema.parse(req.query);

    const page = parseInt(validatedQuery.page || "1");
    const limit = parseInt(validatedQuery.limit || "10");
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };

    if (validatedQuery.search) {
      query.$or = [
        { title: { $regex: validatedQuery.search, $options: "i" } },
        { description: { $regex: validatedQuery.search, $options: "i" } },
      ];
    }

    if (validatedQuery.category) {
      query.category = validatedQuery.category;
    }

    if (validatedQuery.minPrice || validatedQuery.maxPrice) {
      query.price = {};
      if (validatedQuery.minPrice) {
        query.price.$gte = parseFloat(validatedQuery.minPrice);
      }
      if (validatedQuery.maxPrice) {
        query.price.$lte = parseFloat(validatedQuery.maxPrice);
      }
    }

    if (validatedQuery.tags) {
      const tagsArray = validatedQuery.tags.split(",");
      query.tags = { $in: tagsArray };
    }

    const sortBy = validatedQuery.sortBy || "createdAt";
    const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    const [courses, total] = await Promise.all([
      Course.find(query)
        .select("-modules")
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .lean(),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateCourseSchema.parse(req.body);

    const course = await Course.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const CourseControllers = {
  addCourse,
  getCourse,
  getAllCourses,
  updateCourse,
};
