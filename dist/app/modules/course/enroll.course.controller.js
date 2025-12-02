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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollControllers = void 0;
const course_model_1 = require("./course.model");
const enroll_course_model_1 = require("./enroll.course.model");
const enrollCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { courseId, batchId } = req.body;
        const course = yield course_model_1.Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Cannot not found",
            });
        }
        const batchExists = course.batches.some((batch) => batch.batchId === batchId);
        if (!batchExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid batch ID for this course",
            });
        }
        const existingEnrollment = yield enroll_course_model_1.Enrollment.findOne({
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
        const enrollment = yield enroll_course_model_1.Enrollment.create({
            userId,
            courseId,
            batchId,
        });
        res.status(201).json({
            success: true,
            message: "Successfully enrolled in the course",
            data: enrollment,
        });
    }
    catch (error) {
        console.log("Cannot enroll now! Some error occurred", error);
        return res.status(500).json({
            success: false,
            message: "Cannot enroll now! Some error occurred",
        });
    }
});
const getMyEnrollments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const enrollments = yield enroll_course_model_1.Enrollment.find({ userId })
            .populate("courseId", "title description instructor thumbnail price category")
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
    }
    catch (error) {
        next(error);
    }
});
const getCourseEnrollments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { batchId } = req.query;
        const query = { courseId, isDeleted: false };
        if (batchId) {
            query.batchId = batchId;
        }
        const enrollments = yield enroll_course_model_1.Enrollment.find(query)
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
    }
    catch (error) {
        next(error);
    }
});
const markModuleComplete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const { enrollmentId, moduleId } = req.body;
        const enrollment = yield enroll_course_model_1.Enrollment.findOne({
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
        const course = yield course_model_1.Course.findById(enrollment.courseId);
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
            return;
        }
        const moduleExists = course.modules.some((module) => module._id.toString() === moduleId);
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
        yield enrollment.save();
        res.status(200).json({
            success: true,
            message: "Module marked as completed",
            data: {
                progress: enrollment.progress,
                completedModules: enrollment.completedModules,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const getEnrollmentProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { enrollmentId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const enrollment = yield enroll_course_model_1.Enrollment.findOne({
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
    }
    catch (error) {
        next(error);
    }
});
const unenrollCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { enrollmentId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const enrollment = yield enroll_course_model_1.Enrollment.findOneAndUpdate({ _id: enrollmentId, userId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
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
    }
    catch (error) {
        next(error);
    }
});
exports.EnrollControllers = {
    enrollCourse,
    getMyEnrollments,
    getCourseEnrollments,
    getEnrollmentProgress,
    markModuleComplete,
    unenrollCourse,
};
