"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const course_validation_1 = require("./course.validation");
const course_model_1 = require("./course.model");
const mongoose_1 = __importDefault(require("mongoose"));
const addCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = course_validation_1.createCourseSchema.parse(req.body);
        const courseData = Object.assign(Object.assign({}, validatedData), { batches: validatedData.batches.map((batch) => (Object.assign(Object.assign({}, batch), { startDate: new Date(batch.startDate), endDate: batch.endDate ? new Date(batch.endDate) : undefined }))) });
        const course = yield course_model_1.Course.create(courseData);
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    }
    catch (error) {
        console.log("Sorry could not add course right now", error);
        return res.status(500).json({
            success: false,
            message: "Sorry could not add course right now",
        });
    }
});
const getCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id || req.query.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }
        const course = yield course_model_1.Course.findOne({ _id: id, isDeleted: false });
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
    }
    catch (error) {
        console.log("Sorry could not get course right now", error);
        return res.status(500).json({
            success: false,
            message: "Sorry could not get course right now",
        });
    }
});
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedQuery = course_validation_1.courseQuerySchema.parse(req.query);
        const page = parseInt(validatedQuery.page || "1");
        const limit = parseInt(validatedQuery.limit || "10");
        const skip = (page - 1) * limit;
        const query = { isDeleted: false };
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
        const sort = { [sortBy]: sortOrder };
        const [courses, total] = yield Promise.all([
            course_model_1.Course.find(query)
                .select("-modules")
                .skip(skip)
                .limit(limit)
                .sort(sort)
                .lean(),
            course_model_1.Course.countDocuments(query),
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
    }
    catch (error) {
        console.log("Sorry could not get course right now", error);
        return res.status(500).json({
            success: false,
            message: "Sorry could not get any courses right now",
        });
    }
});
const updateCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const validatedData = course_validation_1.updateCourseSchema.parse(req.body);
        const course = yield course_model_1.Course.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: validatedData }, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.log("Sorry could not update course right now", error);
        return res.status(500).json({
            success: false,
            message: "Sorry could not update course right now",
        });
    }
});
const deleteCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //   const course = await Course.findOneAndUpdate(
        //     { _id: id, isDeleted: false },
        //     { $set: { isDeleted: true } },
        //     { new: true }
        //   );
        const course = yield course_model_1.Course.findByIdAndDelete({ _id: id });
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.log("Sorry could not update course right now", error);
        return res.status(500).json({
            success: false,
            message: "Sorry could not delete course right now",
        });
    }
});
exports.CourseControllers = {
    addCourse,
    getCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
};
