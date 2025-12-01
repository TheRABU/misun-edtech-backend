import mongoose, { Schema, Document } from "mongoose";

interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleId: string;
  title: string;
  description?: string;
  questions: IQuestion[];
  passingScore: number;
  duration?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
    points: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    duration: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ courseId: 1, moduleId: 1 });

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
