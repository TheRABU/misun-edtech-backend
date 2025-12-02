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
exports.QuizControllers = void 0;
const course_model_1 = require("./course.model");
const course_quiz_model_1 = require("./course.quiz.model");
const enroll_course_model_1 = require("./enroll.course.model");
const course_quiz_attempt_model_1 = require("./course.quiz.attempt.model");
/// routes starts here
const createQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, moduleId } = req.body;
        const course = yield course_model_1.Course.findOne({ _id: courseId, isDeleted: false });
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
            return;
        }
        const moduleExists = course.modules.some((module) => module._id.toString() === moduleId);
        if (!moduleExists) {
            res.status(400).json({
                success: false,
                message: "Invalid module ID for this course",
            });
            return;
        }
        const quiz = yield course_quiz_model_1.Quiz.create(req.body);
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz,
        });
    }
    catch (error) {
        next(error);
    }
});
const getQuizzesByCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { moduleId } = req.query;
        const query = { courseId, isDeleted: false };
        if (moduleId) {
            query.moduleId = moduleId;
        }
        const quizzes = yield course_quiz_model_1.Quiz.find(query)
            .select("-questions.correctAnswer")
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: quizzes,
        });
    }
    catch (error) {
        next(error);
    }
});
const getQuizById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quiz = yield course_quiz_model_1.Quiz.findOne({ _id: id, isDeleted: false })
            .populate("courseId", "title")
            .lean();
        //   quiz = await Quiz.findOne({ _id: id, isDeleted: false })
        //     .select("-questions.correctAnswer")
        //     .populate("courseId", "title")
        //     .lean();
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }
        res.status(200).json({
            success: true,
            data: quiz,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quiz = yield course_quiz_model_1.Quiz.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: req.body }, { new: true, runValidators: true });
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: quiz,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quiz = yield course_quiz_model_1.Quiz.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
const attemptQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { quizId, answers } = req.body;
        const quiz = yield course_quiz_model_1.Quiz.findOne({ _id: quizId, isDeleted: false });
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        const enrollment = yield enroll_course_model_1.Enrollment.findOne({
            userId,
            courseId: quiz.courseId,
            isDeleted: false,
        });
        if (!enrollment) {
            res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
            });
            return;
        }
        let totalPoints = 0;
        let earnedPoints = 0;
        const evaluatedAnswers = answers.map((answer) => {
            const question = quiz.questions[answer.questionIndex];
            if (!question) {
                return {
                    questionIndex: answer.questionIndex,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect: false,
                    pointsEarned: 0,
                };
            }
            const isCorrect = question.correctAnswer === answer.selectedAnswer;
            const pointsEarned = isCorrect ? question.points : 0;
            totalPoints += question.points;
            earnedPoints += pointsEarned;
            return {
                questionIndex: answer.questionIndex,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                pointsEarned,
            };
        });
        quiz.questions.forEach((q) => {
            if (!answers.some((a) => a.questionIndex === quiz.questions.indexOf(q))) {
                totalPoints += q.points;
            }
        });
        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = score >= quiz.passingScore;
        const attempt = yield course_quiz_attempt_model_1.QuizAttempt.create({
            quizId,
            userId,
            answers: evaluatedAnswers,
            score,
            totalPoints: earnedPoints,
            passed,
        });
        res.status(201).json({
            success: true,
            message: passed ? "Quiz passed!" : "Quiz completed",
            data: {
                score,
                totalPoints: earnedPoints,
                maxPoints: totalPoints,
                passed,
                passingScore: quiz.passingScore,
                answers: evaluatedAnswers,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyAttempts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { quizId } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const query = { userId, isDeleted: false };
        if (quizId) {
            query.quizId = quizId;
        }
        const attempts = yield course_quiz_attempt_model_1.QuizAttempt.find(query)
            .populate({
            path: "quizId",
            select: "title courseId moduleId passingScore",
            populate: {
                path: "courseId",
                select: "title",
            },
        })
            .sort({ attemptedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: attempts,
        });
    }
    catch (error) {
        next(error);
    }
});
const getQuizAttempts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const attempts = yield course_quiz_attempt_model_1.QuizAttempt.find({
            quizId,
            isDeleted: false,
        })
            .populate("userId", "name email")
            .sort({ attemptedAt: -1 })
            .lean();
        const stats = {
            total: attempts.length,
            passed: attempts.filter((a) => a.passed).length,
            failed: attempts.filter((a) => !a.passed).length,
            averageScore: attempts.length > 0
                ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
                : 0,
        };
        res.status(200).json({
            success: true,
            data: {
                stats,
                attempts,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.QuizControllers = {
    getQuizAttempts,
    getMyAttempts,
    attemptQuiz,
    deleteQuiz,
    updateQuiz,
    getQuizById,
    getQuizzesByCourse,
    createQuiz,
};
