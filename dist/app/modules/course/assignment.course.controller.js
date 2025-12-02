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
exports.AssignmentControllers = void 0;
const course_model_1 = require("./course.model");
const course_assignment_model_1 = require("./course.assignment.model");
const enroll_course_model_1 = require("./enroll.course.model");
const course_assignment_submission_model_1 = require("./course.assignment.submission.model");
/// admin routes
const createAssignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, moduleId } = req.body;
        const course = yield course_model_1.Course.findOne({ _id: courseId, isDeleted: false });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        const moduleExists = course.modules.some((module) => module._id.toString() === moduleId);
        if (!moduleExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid module ID for this course",
            });
        }
        const assignment = yield course_assignment_model_1.Assignment.create(req.body);
        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            data: assignment,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAssignmentsByCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { moduleId } = req.query;
        const query = { courseId, isDeleted: false };
        if (moduleId) {
            query.moduleId = moduleId;
        }
        const assignments = yield course_assignment_model_1.Assignment.find(query)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: assignments,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAssignmentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assignment = yield course_assignment_model_1.Assignment.findOne({ _id: id, isDeleted: false })
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
    }
    catch (error) {
        next(error);
    }
});
const updateAssignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assignment = yield course_assignment_model_1.Assignment.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: req.body }, { new: true, runValidators: true });
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
    }
    catch (error) {
        next(error);
    }
});
const deleteAssignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assignment = yield course_assignment_model_1.Assignment.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
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
    }
    catch (error) {
        next(error);
    }
});
const getAllSubmissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId } = req.params;
        const submissions = yield course_assignment_submission_model_1.AssignmentSubmission.find({
            assignmentId,
            isDeleted: false,
        })
            .populate("userId", "name email")
            .sort({ submittedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: {
                total: submissions.length,
                submissions,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const gradeAssignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { submissionId, score, feedback } = req.body;
        const submission = yield course_assignment_submission_model_1.AssignmentSubmission.findOne({
            _id: submissionId,
            isDeleted: false,
        });
        if (!submission) {
            res.status(404).json({
                success: false,
                message: "Submission not found",
            });
            return;
        }
        const assignment = yield course_assignment_model_1.Assignment.findById(submission.assignmentId);
        if (assignment && score > assignment.maxScore) {
            res.status(400).json({
                success: false,
                message: `Score cannot exceed maximum score of ${assignment.maxScore}`,
            });
            return;
        }
        submission.score = score;
        submission.feedback = feedback;
        yield submission.save();
        res.status(200).json({
            success: true,
            message: "Assignment graded successfully",
            data: submission,
        });
    }
    catch (error) {
        next(error);
    }
});
// admin routes ends here
// student related routes
const submitAssignment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { assignmentId, submissionUrl, submissionText } = req.body;
        const assignment = yield course_assignment_model_1.Assignment.findOne({
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
        const enrollment = yield enroll_course_model_1.Enrollment.findOne({
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
        const existingSubmission = yield course_assignment_submission_model_1.AssignmentSubmission.findOne({
            assignmentId,
            userId,
            isDeleted: false,
        });
        if (existingSubmission) {
            existingSubmission.submissionUrl = submissionUrl;
            existingSubmission.submissionText = submissionText;
            existingSubmission.submittedAt = new Date();
            yield existingSubmission.save();
            res.status(200).json({
                success: true,
                message: "Assignment resubmitted successfully",
                data: existingSubmission,
            });
            return;
        }
        const submission = yield course_assignment_submission_model_1.AssignmentSubmission.create({
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
    }
    catch (error) {
        next(error);
    }
});
const getMySubmissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { courseId } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const query = { userId, isDeleted: false };
        const submissions = yield course_assignment_submission_model_1.AssignmentSubmission.find(query)
            .populate({
            path: "assignmentId",
            select: "title courseId moduleId maxScore",
            populate: {
                path: "courseId",
                select: "title",
            },
        })
            .sort({ submittedAt: -1 })
            .lean();
        let filteredSubmissions = submissions;
        if (courseId) {
            filteredSubmissions = submissions.filter((sub) => { var _a, _b; return ((_b = (_a = sub.assignmentId) === null || _a === void 0 ? void 0 : _a.courseId) === null || _b === void 0 ? void 0 : _b._id.toString()) === courseId; });
        }
        res.status(200).json({
            success: true,
            data: filteredSubmissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AssignmentControllers = {
    createAssignment,
    getAssignmentsByCourse,
    getAssignmentById,
    getAllSubmissions,
    updateAssignment,
    gradeAssignment,
    deleteAssignment,
    submitAssignment,
    getMySubmissions,
};
