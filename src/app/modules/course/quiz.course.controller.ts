import { Request, Response, NextFunction } from "express";
import { Course } from "./course.model";
import { Quiz } from "./course.quiz.model";
import { Enrollment } from "./enroll.course.model";
import { QuizAttempt } from "./course.quiz.attempt.model";

const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, moduleId } = req.body;

    const course = await Course.findOne({ _id: courseId, isDeleted: false });

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
      res.status(400).json({
        success: false,
        message: "Invalid module ID for this course",
      });
      return;
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

const getQuizzesByCourse = async (
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

    const quizzes = await Quiz.find(query)
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ _id: id, isDeleted: false })
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
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: req.body },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

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
  } catch (error) {
    next(error);
  }
};

const attemptQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { quizId, answers } = req.body;

    const quiz = await Quiz.findOne({ _id: quizId, isDeleted: false });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    const enrollment = await Enrollment.findOne({
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

    const score =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
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
  } catch (error) {
    next(error);
  }
};

const getMyAttempts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { quizId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const query: any = { userId, isDeleted: false };

    if (quizId) {
      query.quizId = quizId;
    }

    const attempts = await QuizAttempt.find(query)
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
  } catch (error) {
    next(error);
  }
};

const getQuizAttempts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quizId } = req.params;

    const attempts = await QuizAttempt.find({
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
      averageScore:
        attempts.length > 0
          ? Math.round(
              attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
            )
          : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        attempts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const QuizControllers = {
  getQuizAttempts,
  getMyAttempts,
  attemptQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizById,
  getQuizzesByCourse,
  createQuiz,
};
